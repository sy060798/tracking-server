const express = require("express");
const cors = require("cors");

const app = express();

// ✅ CORS
app.use(cors());

// ✅ FIX LIMIT BESAR
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

  database = database.filter(d => !ids.includes(String(d.id)));

  res.json({
    status: "deleted",
    total: database.length
  });
});

// ================= CLEAR =================
app.post("/api/clear", (req, res) => {
  database = [];
  res.json({ status: "cleared" });
});

// ================= START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
