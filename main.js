const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "data.json");

// ===== HELPERS =====
async function loadData() {
  try {
    const exists = await fs.pathExists(DATA_FILE);
    if (!exists) return [];
    const json = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(json);
  } catch (err) {
    console.error("Load data error:", err);
    return [];
  }
}

async function saveData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Save data error:", err);
  }
}

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.send("Server jalan 🚀");
});

app.get("/api/get", async (req, res) => {
  const data = await loadData();
  res.json(data);
});

app.post("/api/save", async (req, res) => {
  try {
    const incomingData = req.body; // array dari frontend
    if (!Array.isArray(incomingData)) return res.status(400).json({ message: "Data harus array" });

    let existingData = await loadData();

    // merge data: update jika ada id sama, insert baru kalau id belum ada
    incomingData.forEach(d => {
      const idx = existingData.findIndex(e => String(e.id) === String(d.id));
      if (idx >= 0) {
        existingData[idx] = d;
      } else {
        existingData.push(d);
      }
    });

    await saveData(existingData);
    res.json({ status: "ok", total: existingData.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error" });
  }
});

// DELETE optional
app.delete("/api/delete/:id", async (req, res) => {
  const id = req.params.id;
  let data = await loadData();
  data = data.filter(d => String(d.id) !== String(id));
  await saveData(data);
  res.json({ status: "ok" });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
