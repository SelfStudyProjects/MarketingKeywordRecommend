class RecommendationEngine {
    calculate(keywordData) {
        const scoredKeywords = [];
        
        for (const data of keywordData) {
            const score = this.calculateScore(data);
            scoredKeywords.push({
                ...data,
                recommendationScore: score,
                reasoning: this.generateReasoning(data, score)
            });
        }
        
        // 점수순 정렬
        return scoredKeywords.sort((a, b) => b.recommendationScore - a.recommendationScore);
    }
    
    calculateScore(data) {
        // 가중치 설정
        const searchVolumeWeight = 0.4;
        const competitionWeight = 0.3;
        const cpcWeight = 0.2;
        const trendWeight = 0.1;
        
        // 각 항목 정규화 (0-1 스케일)
        const normalizedSearchVolume = this.normalize(data.searchVolume, 0, 10000);
        const normalizedCompetition = this.normalizeCompetition(data.competition);
        const normalizedCPC = 1 - this.normalize(data.avgCPC, 0, 1000);
        const normalizedTrend = this.normalize(data.trendScore, 0, 100);
        
        // 최종 점수 계산
        const finalScore = (
            normalizedSearchVolume * searchVolumeWeight +
            normalizedCompetition * competitionWeight +
            normalizedCPC * cpcWeight +
            normalizedTrend * trendWeight
        ) * 100;
        
        return Math.round(finalScore);
    }
    
    normalize(value, min, max) {
        return Math.max(0, Math.min(1, (value - min) / (max - min)));
    }
    
    normalizeCompetition(competition) {
        const competitionMap = { 'low': 0.8, 'medium': 0.5, 'high': 0.2 };
        return competitionMap[competition] || 0.5;
    }
    
    generateReasoning(data, score) {
        const reasons = [];
        
        if (data.searchVolume > 1000) reasons.push('높은 검색량');
        if (data.competition === 'low') reasons.push('낮은 경쟁도');
        if (data.avgCPC < 200) reasons.push('합리적인 광고비');
        if (data.trendScore > 70) reasons.push('상승 트렌드');
        
        return reasons.join(', ') || '균형잡힌 키워드';
    }
}

module.exports = new RecommendationEngine();