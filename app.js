const express = require('express');
const cors = require('cors');
const app = express();
const videoRoutes = require('./routes/videoRoutes');
const quizRoutes = require('./routes/quizRoutes');
const bkframe2Routes=require('./routes/bkframe2Routes.js');
const feedback = require('./routes/feedback.js');  // 新增的反馈路由

app.use(cors());
app.use(express.json());  // 解析 JSON 

app.use('/api', videoRoutes);
app.use('/api', quizRoutes);
app.use('/api', bkframe2Routes);
app.use('/api', feedback); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
