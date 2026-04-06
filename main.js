const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let database = []; // sementara (nanti bisa upgrade DB)

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
  database.push(data);
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
