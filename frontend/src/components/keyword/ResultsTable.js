// PSEUDO CODE: 결과 테이블 컴포넌트
// IMPORT React, { useState, useMemo }
// IMPORT Table, TableHead, TableBody, TableRow, TableCell, Button
// IMPORT formatters from utils/formatters
//
// FUNCTION ResultsTable({ data, inputKeywords }):
//     [sortConfig, setSortConfig] = useState({ key: 'recommendationScore', direction: 'desc' })
//     [filterConfig, setFilterConfig] = useState({ minScore: 0, maxCPC: 1000 })
//     // [추가] 페이징 상태
//     [currentPage, setCurrentPage] = useState(1)
//     itemsPerPage = 10
//     
//     // 정렬 및 필터링된 데이터
//     processedData = useMemo(() => {
//         filtered = data.filter(item => 
//             item.recommendationScore >= filterConfig.minScore AND
//             item.avgCPC <= filterConfig.maxCPC
//         )
//         
//         sorted = filtered.sort((a, b) => {
//             IF sortConfig.direction === 'asc':
//                 RETURN a[sortConfig.key] - b[sortConfig.key]
//             ELSE:
//                 RETURN b[sortConfig.key] - a[sortConfig.key]
//         })
//         
//         RETURN sorted
//     }, [data, sortConfig, filterConfig])
//     
//     // [추가] 페이징된 데이터
//     paginatedData = useMemo(() => {
//         startIndex = (currentPage - 1) * itemsPerPage
//         endIndex = startIndex + itemsPerPage
//         RETURN processedData.slice(startIndex, endIndex)
//     }, [processedData, currentPage])
//     
//     totalPages = Math.ceil(processedData.length / itemsPerPage)
//     
//     FUNCTION handleSort(columnKey):
//         IF sortConfig.key === columnKey:
//             // 동일 컬럼 클릭 시 방향 변경
//             setSortConfig({
//                 key: columnKey,
//                 direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
//             })
//         ELSE:
//             setSortConfig({ key: columnKey, direction: 'desc' })
//     
//     FUNCTION handleExport():
//         // CSV 형태로 데이터 내보내기
//         csvContent = "키워드,검색량,경쟁도,평균CPC,추천점수,이유\n"
//         
//         FOR each item IN processedData:
//             csvContent += `${item.keyword},${item.searchVolume},${item.competition},${item.avgCPC},${item.recommendationScore},"${item.reasoning}"\n`
//         
//         // 파일 다운로드 트리거
//         downloadCSV(csvContent, `키워드분석결과_${new Date().toISOString().split('T')[0]}.csv`)
//     
//     FUNCTION getScoreColor(score):
//         IF score >= 80: RETURN 'success'
//         IF score >= 60: RETURN 'warning'
//         RETURN 'error'
//     
//     FUNCTION getCompetitionIcon(competition):
//         competitionIcons = {
//             'low': '🟢',
//             'medium': '🟡', 
//             'high': '🔴'
//         }
//         RETURN competitionIcons[competition] || '⚪'
//     
//     RETURN (
//         <div className="results-container">
//             <div className="results-header">
//                 <h2>키워드 추천 결과</h2>
//                 <div className="results-summary">
//                     <p>입력 키워드: {inputKeywords.join(', ')}</p>
//                     <p>추천 키워드: {processedData.length}개</p>
//                 </div>
//                 
//                 <div className="results-actions">
//                     <Button onClick={handleExport} variant="outlined">
//                         결과 내보내기
//                     </Button>
//                 </div>
//             </div>
//             
//             <div className="filters">
//                 <TextField
//                     label="최소 추천 점수"
//                     type="number"
//                     value={filterConfig.minScore}
//                     onChange={(e) => setFilterConfig({
//                         ...filterConfig,
//                         minScore: parseInt(e.target.value) || 0
//                     })}
//                 />
//                 
//                 <TextField
//                     label="최대 광고비"
//                     type="number"
//                     value={filterConfig.maxCPC}
//                     onChange={(e) => setFilterConfig({
//                         ...filterConfig,
//                         maxCPC: parseInt(e.target.value) || 1000
//                     })}
//                 />
//             </div>
//             
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell onClick={() => handleSort('recommendationScore')} className="sortable">
//                             추천 점수 {getSortIcon('recommendationScore')}
//                         </TableCell>
//                         <TableCell onClick={() => handleSort('keyword')} className="sortable">
//                             키워드 {getSortIcon('keyword')}
//                         </TableCell>
//                         <TableCell onClick={() => handleSort('searchVolume')} className="sortable">
//                             월간 검색량 {getSortIcon('searchVolume')}
//                         </TableCell>
//                         <TableCell>경쟁도</TableCell>
//                         <TableCell onClick={() => handleSort('avgCPC')} className="sortable">
//                             평균 광고비 {getSortIcon('avgCPC')}
//                         </TableCell>
//                         <TableCell>추천 이유</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 
//                 <TableBody>
//                     {paginatedData.map((row, index) => (
//                         <TableRow 
//                             key={row.keyword}
//                             className={index < 5 ? 'top-recommendation' : ''}
//                         >
//                             <TableCell>
//                                 <div className={`score-badge score-${getScoreColor(row.recommendationScore)}`}>
//                                     {row.recommendationScore}점
//                                 </div>
//                             </TableCell>
//                             
//                             <TableCell className="keyword-cell">
//                                 <strong>{row.keyword}</strong>
//                             </TableCell>
//                             
//                             <TableCell>
//                                 {formatters.formatNumber(row.searchVolume)}
//                             </TableCell>
//                             
//                             <TableCell>
//                                 {getCompetitionIcon(row.competition)} {row.competition}
//                             </TableCell>
//                             
//                             <TableCell>
//                                 {formatters.formatCurrency(row.avgCPC)}원
//                             </TableCell>
//                             
//                             <TableCell className="reasoning-cell">
//                                 {row.reasoning}
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//             
//             // [추가] 페이징 컨트롤
//             <div className="pagination">
//                 <Button 
//                     onClick={() => setCurrentPage(currentPage - 1)} 
//                     disabled={currentPage === 1}
//                 >
//                     이전
//                 </Button>
//                 <span>페이지 {currentPage} / {totalPages}</span>
//                 <Button 
//                     onClick={() => setCurrentPage(currentPage + 1)} 
//                     disabled={currentPage === totalPages}
//                 >
//                     다음
//                 </Button>
//             </div>
//             
//             IF processedData.length === 0:
//                 <div className="no-results">
//                     <p>필터 조건에 맞는 키워드가 없습니다.</p>
//                     <Button onClick={() => setFilterConfig({ minScore: 0, maxCPC: 1000 })}>
//                         필터 초기화
//                     </Button>
//                 </div>
//         </div>
//     )
//     
//     FUNCTION getSortIcon(columnKey):
//         IF sortConfig.key !== columnKey:
//             RETURN '↕️'
//         RETURN sortConfig.direction === 'asc' ? '⬆️' : '⬇️'
//
// EXPORT ResultsTable
