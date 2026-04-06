const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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
  const data = req.body;

  // 🔥 pastikan array
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "Data harus array" });
  }

  // 🔥 flatten (antisipasi nested)
  let incoming = data.flat();

  // 🔥 filter data valid
  incoming = incoming.filter(d => d && typeof d === "object");

  // 🔥 ANTI DUPLIKAT pakai ID
  let map = new Map();

  // data lama
  database.forEach(d => {
    if (d && d.id) {
      map.set(String(d.id), d);
    }
  });

  // overwrite dari data baru
  incoming.forEach(d => {
    if (d && d.id) {
      map.set(String(d.id), d);
    }
  });

  database = Array.from(map.values());

  res.json({
    status: "ok",
    total: database.length
  });
});

// ================= DELETE DATA =================
app.post("/api/delete", (req, res) => {
  const ids = req.body;

  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: "ID harus array" });
  }

  // 🔥 hapus berdasarkan ID
  database = database.filter(d => !ids.includes(String(d.id)));

  res.json({
    status: "deleted",
    total: database.length
  });
});

// ================= CLEAR ALL =================
app.post("/api/clear", (req, res) => {
  database = [];

  res.json({
    status: "cleared"
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
