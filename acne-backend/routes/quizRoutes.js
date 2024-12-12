const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// 创建MySQL连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'acne',
    charset: 'utf8mb4' // 设置字符编码为UTF-8
});

// 定义路由处理程序
router.get('/quiz/:topic', async (req, res) => {
  const { topic } = req.params;
  try {
    // 从连接池中获取连接
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting MySQL connection:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      
      // 执行查询
      connection.query('SELECT id, topic, que, A, B, C, D, ans FROM quizs WHERE topic = ? ', [topic], (err, rows) => {
        // 释放连接
        connection.release();

        if (err) {
          console.error('Error executing query:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        if (!Array.isArray(rows) || rows.length === 0) {
          console.error('No rows found for topic:', topic);
          res.status(404).json({ error: 'Topic not found' });
          return;
        }

        // 返回查询结果
        res.json(rows);
      });
    });
  } catch (error) {
    console.error('Error fetching quiz data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 导出路由模块
module.exports = router;
