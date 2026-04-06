const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let database = []; // sementara

// TEST
app.get("/", (req, res) => {
  res.send("Server jalan 🚀");
});

// GET DATA
app.get("/api/get", (req, res) => {
  res.json(database);
});

// SAVE DATA
app.post("/api/save", (req, res) => {
  const data = req.body;

  // 🔥 pastikan array
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: "Data harus array" });
  }

  // 🔥 flatten (antisipasi nested dari client lama)
  let incoming = data.flat();

  // 🔥 filter data valid saja
  incoming = incoming.filter(d => d && typeof d === "object");

  // 🔥 ANTI DUPLIKAT berdasarkan ID
  let map = new Map();

  // ambil data lama
  database.forEach(d => {
    if (d && d.id) {
      map.set(d.id, d);
    }
  });

  // overwrite dengan data baru
  incoming.forEach(d => {
    if (d && d.id) {
      map.set(d.id, d);
    }
  });

  // hasil akhir
  database = Array.from(map.values());

  res.json({ status: "ok", total: database.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
