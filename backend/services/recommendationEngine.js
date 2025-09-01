// PSEUDO CODE: 키워드 추천 알고리즘
// CLASS RecommendationEngine:
//     FUNCTION calculate(keywordData):
//         scoredKeywords = []
//         FOR each data IN keywordData:
//             score = this.calculateScore(data)
//             scoredKeywords.push({
//                 ...data,
//                 recommendationScore: score,
//                 reasoning: this.generateReasoning(data, score)
//             })
//         // 점수순 정렬
//         sortedKeywords = scoredKeywords.sort((a, b) => b.recommendationScore - a.recommendationScore)
//         // [추가] 상위 N개만 반환 (예: 20개)
//         RETURN sortedKeywords.slice(0, 20)
//     FUNCTION calculateScore(data):
//         // 가중치 설정
//         searchVolumeWeight = 0.4      // 검색량 40%
//         competitionWeight = 0.3       // 경쟁도 30%
//         cpcWeight = 0.2              // 클릭단가 20%
//         trendWeight = 0.1            // 트렌드 10%
//         // 각 항목 정규화 (0-1 스케일)
//         normalizedSearchVolume = this.normalize(data.searchVolume, 0, 10000)
//         normalizedCompetition = this.normalizeCompetition(data.competition)
//         normalizedCPC = 1 - this.normalize(data.avgCPC, 0, 1000) // CPC는 낮을수록 좋음
//         normalizedTrend = this.normalize(data.trendScore, 0, 100)
//         // 최종 점수 계산
//         finalScore = (
//             normalizedSearchVolume * searchVolumeWeight +
//             normalizedCompetition * competitionWeight +
//             normalizedCPC * cpcWeight +
//             normalizedTrend * trendWeight
//         ) * 100
//         RETURN Math.round(finalScore)
//     FUNCTION normalize(value, min, max):
//         RETURN Math.max(0, Math.min(1, (value - min) / (max - min)))
//     FUNCTION normalizeCompetition(competition):
//         competitionMap = { 'low': 0.8, 'medium': 0.5, 'high': 0.2 }
//         RETURN competitionMap[competition] || 0.5
//     FUNCTION generateReasoning(data, score):
//         reasons = []
//         IF data.searchVolume > 1000:
//             reasons.push('높은 검색량')
//         IF data.competition === 'low':
//             reasons.push('낮은 경쟁도')
//         IF data.avgCPC < 200:
//             reasons.push('합리적인 광고비')
//         IF data.trendScore > 70:
//             reasons.push('상승 트렌드')
//         RETURN reasons.join(', ') || '균형잡힌 키워드'
// EXPORT new RecommendationEngine()
