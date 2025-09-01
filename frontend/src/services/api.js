// PSEUDO CODE: API 호출 서비스
// IMPORT axios
//
// CLASS ApiService:
//     constructor():
//         this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000'
//         this.client = axios.create({
//             baseURL: this.baseURL,
//             timeout: 30000, // 30초 타임아웃
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//         
//         // 요청/응답 인터셉터 설정
//         this.setupInterceptors()
//     
//     FUNCTION setupInterceptors():
//         // 요청 인터셉터
//         this.client.interceptors.request.use(
//             config => {
//                 console.log(`API 요청: ${config.method.toUpperCase()} ${config.url}`)
//                 RETURN config
//             },
//             error => Promise.reject(error)
//         )
//         
//         // 응답 인터셉터
//         this.client.interceptors.response.use(
//             response => {
//                 console.log(`API 응답: ${response.status} ${response.config.url}`)
//                 RETURN response.data
//             },
//             error => {
//                 console.error('API 오류:', error.response?.data || error.message)
//                 
//                 IF error.response?.status === 429:
//                     THROW new Error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.')
//                 
//                 IF error.response?.status === 500:
//                     THROW new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
//                 
//                 IF error.code === 'ECONNABORTED':
//                     THROW new Error('요청 시간이 초과되었습니다. 네트워크를 확인해주세요.')
//                 
//                 THROW new Error(error.response?.data?.message || '알 수 없는 오류가 발생했습니다.')
//             }
//         )
//     
//     // 키워드 분석 API 호출
//     FUNCTION async analyzeKeywords(seedKeywords, businessDomain = '속기'):
//         TRY:
//             response = await this.client.post('/api/keywords/analyze', {
//                 seedKeywords: seedKeywords,
//                 businessDomain: businessDomain
//             })
//             
//             RETURN response
//             
//         CATCH error:
//             console.error('키워드 분석 실패:', error)
//             THROW error
//     
//     // 키워드 자동완성 API 호출
//     FUNCTION async getKeywordSuggestions(partial):
//         TRY:
//             response = await this.client.get('/api/keywords/suggestions', {
//                 params: { q: partial }
//             })
//             
//             RETURN response.suggestions || []
//             
//         CATCH error:
//             console.error('자동완성 실패:', error)
//             RETURN [] // 자동완성 실패 시 빈 배열 반환
//     
//     // 서버 상태 확인
//     FUNCTION async checkHealth():
//         TRY:
//             response = await this.client.get('/health')
//             RETURN response.status === 'OK'
//         CATCH error:
//             RETURN false
//
// EXPORT new ApiService()
