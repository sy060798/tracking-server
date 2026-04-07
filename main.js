const express = require("express");
const cors = require("cors");

const app = express();

// ✅ CORS
app.use(cors());

// ✅ LIMIT (cukup 10–20mb sudah aman)
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

let database = []; // sementara (RAM)

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("Server jalan 🚀");
});

// ================= GET DATA =================
app.get("/api/get", (req, res) => {
  res.json(database);
});

// ================= SAVE DATA =================
app.post("/api/save", (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Data harus array" });
    }

    let incoming = data.flat().filter(d => d && typeof d === "object");

    let map = new Map();

    database.forEach(d => {
      if (d && d.id) {
        map.set(String(d.id), d);
      }
    });

    incoming.forEach(d => {
      if (d && d.id) {
        map.set(String(d.id), d);
      }
    });

    database = Array.from(map.values());

    console.log("TOTAL DATA:", database.length); // 🔥 log

    res.json({
      status: "ok",
      total: database.length
    });

  } catch (err) {
    console.error("ERROR SAVE:", err);
    res.status(500).json({ error: "Server error saat save" });
  }
});

// ================= DELETE DATA =================
app.post("/api/delete", (req, res) => {
  try {
    const ids = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "ID harus array" });
    }

    database = database.filter(d => !ids.includes(String(d.id)));

    res.json({
      status: "deleted",
      total: database.length
    });

  } catch (err) {
    console.error("ERROR DELETE:", err);
    res.status(500).json({ error: "Server error saat delete" });
  }
});

// ================= CLEAR =================
app.post("/api/clear", (req, res) => {
  database = [];
  res.json({ status: "cleared" });
});

// ================= ERROR HANDLER GLOBAL =================
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ error: "Terjadi error di server" });
});

// ================= START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
