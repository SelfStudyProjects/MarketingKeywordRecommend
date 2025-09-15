const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우터 연결
const keywordsRouter = require('./routes/keywords');
app.use('/api/keywords', keywordsRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행중입니다`);
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});