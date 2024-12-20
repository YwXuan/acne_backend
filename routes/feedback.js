const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// MySQL 資料庫連接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'acne',
  charset: 'utf8mb4'
}).promise(); // 使用 Promise API

// POST 路由處理反饋資料
router.post('/feedback', async (req, res) => {
  const {
    courseEvaluation, learningTransfer, name, postTestScore, preTestScore, selfEvaluation
  } = req.body;

  console.log("Received data:", req.body);

  // 驗證輸入
  const isValidArray = (arr) => Array.isArray(arr) && arr.length > 0;
  if (!name || typeof name !== 'string' ||
      !isValidArray(selfEvaluation) || !isValidArray(courseEvaluation) || !isValidArray(learningTransfer)) {
    console.error("Invalid input data:", req.body);
    return res.status(400).json({ error: "Invalid input data" });
  }

  const sql = `
    INSERT INTO feedback (name, pre_score, post_score, question1, question2, question3, question4, question5, question6, question7, question8)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    name,
    preTestScore,
    postTestScore,
    courseEvaluation[0] || null,
    courseEvaluation[1] || null,
    courseEvaluation[2] || null,
    selfEvaluation[0] || null,
    selfEvaluation[1] || null,
    selfEvaluation[2] || null,
    learningTransfer[0] || null,
    learningTransfer[1] || null,
  ];

  let connection;

  try {
    // 獲取連接
    connection = await pool.getConnection();

    // 執行查詢
    const [results] = await connection.query(sql, values);

    res.status(200).json({ message: 'Feedback saved successfully', data: results });
  } catch (error) {
    console.error('Error processing feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    if (connection) connection.release(); // 確保連接釋放
  }
});

module.exports = router;
