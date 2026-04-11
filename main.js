const express = require("express");
const cors = require("cors");

const app = express();

// ================= CONFIG =================
app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// ================= DATABASE (RAM) =================
let database = {
  IKR: [],
  MYREP: []
};

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("🚀 Server Tracking Aktif");
});

// ================= GET DATA =================
app.get("/api/get", (req, res) => {
  try {
    const type = req.query.type || "IKR";

    if (!database[type]) {
      return res.json([]);
    }

    res.json(database[type]);

  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: "Gagal ambil data" });
  }
});

// ================= SAVE DATA =================
app.post("/api/save", (req, res) => {
  try {
    let { type, data } = req.body;

    if (!type || !Array.isArray(data)) {
      return res.status(400).json({
        error: "Format harus { type:'IKR', data:[] }"
      });
    }

    if (!database[type]) {
      database[type] = [];
    }

    let map = new Map();

    // ambil data lama
    database[type].forEach(d => {
      if (d && d.id) {
        map.set(String(d.id), d);
      }
    });

    // merge data baru
    data.forEach(d => {
      if (!d.id) {
        d.id = Date.now() + Math.random(); // 🔥 auto id
      }
      map.set(String(d.id), d);
    });

    database[type] = Array.from(map.values());

    console.log(`✅ ${type} TOTAL:`, database[type].length);

    res.json({
      status: "ok",
      type: type,
      total: database[type].length
    });

  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ error: "Gagal save data" });
  }
});

// ================= DELETE =================
app.post("/api/delete", (req, res) => {
  try {
    let { type, ids } = req.body;

    if (!type || !Array.isArray(ids)) {
      return res.status(400).json({
        error: "Format { type:'IKR', ids:[] }"
      });
    }

    if (!database[type]) {
      return res.json({ status: "ok", total: 0 });
    }

    database[type] = database[type].filter(
      d => !ids.includes(String(d.id))
    );

    res.json({
      status: "deleted",
      type,
      total: database[type].length
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Gagal delete" });
  }
});

// ================= CLEAR =================
app.post("/api/clear", (req, res) => {
  try {
    let { type } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Type wajib" });
    }

    database[type] = [];

    res.json({
      status: "cleared",
      type
    });

  } catch (err) {
    console.error("CLEAR ERROR:", err);
    res.status(500).json({ error: "Gagal clear" });
  }
});

// ================= INFO DEBUG =================
app.get("/api/info", (req, res) => {
  res.json({
    IKR: database.IKR.length,
    MYREP: database.MYREP.length
  });
});

// ================= ERROR GLOBAL =================
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ error: "Terjadi error server" });
});

// ================= START =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
