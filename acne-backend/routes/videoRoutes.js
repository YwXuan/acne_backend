const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// 创建 MySQL 连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'acne'
});

// 定义您的路由
router.get('/video/:topic', (req, res) => {
  const { topic } = req.params;

  // 执行查询
  pool.query('SELECT link FROM videos WHERE topic = ?', [topic], (err, results) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // 处理查询结果
    if (results.length === 0) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    const videoSrc = results[0].link;
    res.json({ videoSrc });
  });
});

// 导出路由模块
module.exports = router;

