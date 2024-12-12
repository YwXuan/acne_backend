const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// MySQL 連線設定
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "acne",
  charset: 'utf8mb4'
});

// 建立 MySQL 連線
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// 定義後端端點，這個端點會根據提供的 id 從資料庫中檢索相應的文字資料
router.get("/textData/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT text FROM texts WHERE id = ?";
  connection.query(query, [id], (error, results, fields) => {
    if (error) {
      console.error("Error retrieving text data from database:", error);
      res.status(500).json({ error: "無法檢索文字資料" });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: "找不到相應的文字資料" });
      return;
    }
    const text = results[0].text;
    res.json({ text });
  });
});

module.exports = router;
