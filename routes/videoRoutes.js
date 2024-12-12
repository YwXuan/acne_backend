const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'acne'
});

// 定義 router 處理程序
router.get('/video/:topic', (req, res) => {
  const { topic } = req.params;

  // 查詢
  pool.query('SELECT link FROM videos WHERE topic = ?', [topic], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // 取得結果
    if (results.length === 0) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    const videoSrc = results[0].link;
    res.json({ videoSrc });
  });
});

// 導出模組
module.exports = router;

