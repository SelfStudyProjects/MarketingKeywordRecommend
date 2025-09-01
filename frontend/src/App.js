// PSEUDO CODE: 메인 React 앱 컴포넌트
// IMPORT React, { useState }
// IMPORT MainLayout, KeywordInput, ResultsTable, Loading
// IMPORT useKeywordAnalysis
//
// FUNCTION App():
//     [analysisState, setAnalysisState] = useState({
//         isLoading: false,
//         results: null,
//         error: null
//     })
//     
//     [inputKeywords, setInputKeywords] = useState([])
//     
//     // 커스텀 훅 사용
//     { analyzeKeywords, isLoading } = useKeywordAnalysis()
//     
//     FUNCTION handleKeywordSubmit(keywords):
//         setInputKeywords(keywords)
//         setAnalysisState({ isLoading: true, results: null, error: null })
//         
//         TRY:
//             results = await analyzeKeywords(keywords)
//             setAnalysisState({ 
//                 isLoading: false, 
//                 results: results, 
//                 error: null 
//             })
//         CATCH error:
//             setAnalysisState({ 
//                 isLoading: false, 
//                 results: null, 
//                 error: error.message 
//             })
//     
//     FUNCTION handleRetry():
//         IF inputKeywords.length > 0:
//             handleKeywordSubmit(inputKeywords)
//     
//     RETURN (
//         <MainLayout>
//             <div className="container">
//                 <h1>네이버 검색광고 키워드 추천</h1>
//                 
//                 <KeywordInput onSubmit={handleKeywordSubmit} />
//                 
//                 IF analysisState.isLoading:
//                     <Loading message="키워드 분석 중..." />
//                     // [추가] 로딩 진행 바: 분석 진행 상황 표시
//                     <ProgressBar progress={analysisState.progress || 0} message="데이터 수집 및 분석 진행 중..." />
//                 
//                 IF analysisState.error:
//                     <div className="error">
//                         <p>오류: {analysisState.error}</p>
//                         <button onClick={handleRetry}>다시 시도</button>
//                     </div>
//                 
//                 IF analysisState.results:
//                     <ResultsTable 
//                         data={analysisState.results.recommendations}
//                         inputKeywords={analysisState.results.inputKeywords}
//                     />
//             </div>
//         </MainLayout>
//     )
//
// EXPORT App
