class NaverDataLab {
    constructor() {
        this.cache = new Map();
    }
    
    async getSearchVolumes(keywords) {
        const results = [];
        
        for (const keyword of keywords) {
            // 캐시 확인
            if (this.cache.has(keyword)) {
                results.push(this.cache.get(keyword));
                continue;
            }
            
            // Mock 데이터 생성 (실제 API 대신)
            const data = this.generateRealisticMockData(keyword);
            
            // 캐시에 저장
            this.cache.set(keyword, data);
            results.push(data);
        }
        
        return results;
    }
    
    generateRealisticMockData(keyword) {
        // 키워드 길이와 타입에 따른 현실적인 데이터 생성
        const baseVolume = this.estimateSearchVolume(keyword);
        const competition = this.estimateCompetition(keyword);
        const avgCPC = this.estimateAvgCPC(keyword, competition);
        
        return {
            keyword: keyword,
            searchVolume: baseVolume + Math.floor(Math.random() * (baseVolume * 0.3)),
            competition: competition,
            avgCPC: avgCPC + Math.floor(Math.random() * 50),
            trendScore: Math.floor(Math.random() * 40) + 50 // 50-90 범위
        };
    }
    
    estimateSearchVolume(keyword) {
        // 키워드 특성에 따른 검색량 추정
        if (keyword.includes('속기')) return 800;
        if (keyword.includes('녹취')) return 600;
        if (keyword.includes('학원')) return 1200;
        if (keyword.includes('자격증')) return 900;
        if (keyword.includes('전문')) return 400;
        
        // 기본값: 키워드 길이에 반비례
        return Math.max(100, 1000 - (keyword.length * 50));
    }
    
    estimateCompetition(keyword) {
        if (keyword.includes('전문') || keyword.includes('최고')) return 'high';
        if (keyword.includes('학원') || keyword.includes('자격증')) return 'medium';
        return 'low';
    }
    
    estimateAvgCPC(keyword, competition) {
        const baseMap = { 'low': 120, 'medium': 180, 'high': 250 };
        return baseMap[competition];
    }
}

module.exports = new NaverDataLab();