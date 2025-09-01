// PSEUDO CODE: 데이터 포맷팅 유틸리티
// CLASS Formatters:
//     
//     // 숫자 포맷팅 (천 단위 콤마)
//     FUNCTION formatNumber(number):
//         IF typeof number !== 'number' OR isNaN(number):
//             RETURN '0'
//         
//         RETURN number.toLocaleString('ko-KR')
//     
//     // 통화 포맷팅
//     FUNCTION formatCurrency(amount):
//         IF typeof amount !== 'number' OR isNaN(amount):
//             RETURN '0'
//         
//         RETURN amount.toLocaleString('ko-KR')
//     
//     // 백분율 포맷팅
//     FUNCTION formatPercentage(value, decimals = 1):
//         IF typeof value !== 'number' OR isNaN(value):
//             RETURN '0%'
//         
//         RETURN `${value.toFixed(decimals)}%`
//     
//     // 점수 포맷팅 (색상 클래스 포함)
//     FUNCTION formatScore(score):
//         IF score >= 80:
//             RETURN { value: score, class: 'score-excellent', label: '우수' }
//         ELSE IF score >= 60:
//             RETURN { value: score, class: 'score-good', label: '양호' }
//         ELSE IF score >= 40:
//             RETURN { value: score, class: 'score-average', label: '보통' }
//         ELSE:
//             RETURN { value: score, class: 'score-poor', label: '부족' }
//     
//     // 경쟁도 포맷팅
//     FUNCTION formatCompetition(competition):
//         competitionMap = {
//             'low': { icon: '🟢', text: '낮음', class: 'competition-low' },
//             'medium': { icon: '🟡', text: '보통', class: 'competition-medium' },
//             'high': { icon: '🔴', text: '높음', class: 'competition-high' }
//         }
//         
//         RETURN competitionMap[competition] || competitionMap['medium']
//     
//     // 날짜 포맷팅
//     FUNCTION formatDate(date):
//         IF NOT date:
//             RETURN ''
//         
//         dateObj = new Date(date)
//         RETURN dateObj.toLocaleDateString('ko-KR', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         })
//     
//     // 키워드 길이별 분류
//     FUNCTION categorizeKeywordLength(keyword):
//         length = keyword.length
//         
//         IF length <= 3:
//             RETURN { type: 'short', label: '단어형', class: 'keyword-short' }
//         ELSE IF length <= 7:
//             RETURN { type: 'medium', label: '구문형', class: 'keyword-medium' }
//         ELSE:
//             RETURN { type: 'long', label: '문장형', class: 'keyword-long' }
//     
//     // CSV 다운로드 헬퍼
//     FUNCTION downloadCSV(csvContent, filename):
//         // BOM 추가 (한글 깨짐 방지)
//         csvWithBOM = '\uFEFF' + csvContent
//         
//         blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' })
//         link = document.createElement('a')
//         
//         IF link.download !== undefined:
//             url = URL.createObjectURL(blob)
//             link.setAttribute('href', url)
//             link.setAttribute('download', filename)
//             link.style.visibility = 'hidden'
//             
//             document.body.appendChild(link)
//             link.click()
//             document.body.removeChild(link)
//             URL.revokeObjectURL(url)
//
// EXPORT new Formatters()
