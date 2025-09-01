// PSEUDO CODE: 메인 서버 설정
// IMPORT express, cors, dotenv
// IMPORT keywordsRouter from routes/keywords
// IMPORT errorHandler from middleware/errorHandler
//
// FUNCTION createServer():
//     app = express()
//     // 미들웨어 설정
//     app.use(cors())
//     app.use(express.json())
//     // 라우터 연결
//     app.use('/api/keywords', keywordsRouter)
//     // 기본 헬스 체크 엔드포인트
//     app.get('/health', (req, res) => {
//         res.json({ status: 'OK', timestamp: new Date() })
//     })
//     // 에러 처리 미들웨어
//     app.use(errorHandler)
//     // 서버 시작
//     PORT = process.env.PORT || 5000
//     server = app.listen(PORT, () => {
//         console.log(`🚀 서버 시작: http://localhost:${PORT}`)
//     })
//     // [추가] Graceful Shutdown 처리
//     PROCESS.on('SIGTERM' or 'SIGINT', () => {
//         server.close(() => {
//             console.log('서버가 안전하게 종료되었습니다.')
//         })
//     })
// CALL createServer()
