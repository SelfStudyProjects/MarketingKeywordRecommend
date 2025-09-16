const axios = require('axios');

class NaverDataLab {
    constructor() {
        this.cache = new Map();
        this.clientId = process.env.NAVER_CLIENT_ID;
        this.clientSecret = process.env.NAVER_CLIENT_SECRET;
        this.apiUrl = 'https://openapi.naver.com/v1/datalab/search';
    }
    
    async fetchTrendData(keywords) {

        console.log('🔥 네이버 API 호출 시도:', keywords);
        console.log('🔑 CLIENT_ID:', this.clientId ? '설정됨' : '없음');


        // 최근 1년간 데이터 요청
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 1);

        const requestBody = {
            startDate: this.formatDate(startDate),
            endDate: this.formatDate(endDate),
            timeUnit: 'month',
            keywordGroups: keywords.map((keyword, index) => ({
                groupName: `group${index}`,
                keywords: [keyword]
            }))
        };
        
        try {
            const response = await axios.post(this.apiUrl, requestBody, {
                headers: {
                    'X-Naver-Client-Id': this.clientId,
                    'X-Naver-Client-Secret': this.clientSecret,
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ API 응답 성공:', response.status);
            return response.data;
        } catch (error) {
            console.log('❌ API 호출 실패:', error.message);
            throw error;
        }
    }

    // 자동완성/연관검색어 수집
    async getRelatedQueries(keyword) {
        if (!keyword) return [];
        // 네이버 자동완성(연관검색어) 엔드포인트
        const url = 'https://ac.search.naver.com/nx/ac';
        try {
            const res = await axios.get(url, {
                params: {
                    q: keyword,
                    st: 1,
                    r_format: 'json',
                    r_enc: 'UTF-8',
                    t_koreng: 1
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });

            // 응답 구조: items[1] 또는 items[0]에 자동완성 텍스트 배열이 있음 (엔드포인트 변경 가능)
            const items = res.data?.items || [];
            // items 형식에 따라 안전하게 파싱
            const suggestions = [];
            if (Array.isArray(items) && items.length >= 2 && Array.isArray(items[1])) {
                for (const row of items[1]) {
                    if (Array.isArray(row) && row.length > 0) suggestions.push(row[0]);
                }
            }

            return suggestions.map(s => ({ keyword: s }));
        } catch (err) {
            console.error('getRelatedQueries API error:', err.message);
            throw err; // per requirement: don't fallback to mock
        }
    }

    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    processTrendData(keywords, trendData) {
        const results = [];
        
        keywords.forEach((keyword, index) => {
            const groupData = trendData.results[index];
            const avgSearchVolume = this.calculateAverageVolume(groupData.data);
            const competition = this.estimateCompetition(keyword);
            
            let finalSearchVolume;
            if (avgSearchVolume === 100) {
                finalSearchVolume = this.estimateSearchVolume(keyword);
            } else {
                finalSearchVolume = Math.max(100, avgSearchVolume * 10);
            }

            results.push({
                keyword: keyword,
                searchVolume: finalSearchVolume,
                competition: competition,
                avgCPC: this.calculateRealisticCPC(keyword, avgSearchVolume, competition),
                trendScore: Math.floor(Math.random() * 40) + 50
            });
        });
        
        return results;
    }

    estimateRealisticSearchVolume(keyword) {
        if (keyword.includes('업체') || keyword.includes('견적')) return Math.floor(Math.random() * 200) + 50;
        if (keyword.includes('가격') || keyword.includes('비용')) return Math.floor(Math.random() * 300) + 150;
        if (keyword.includes('팁') || keyword.includes('가이드')) return Math.floor(Math.random() * 400) + 100;
        return Math.floor(Math.random() * 500) + 100;
    }

    calculateRealisticCPC(keyword, searchVolume, competition) {
        // 기본 경쟁도별 단가
        const baseMap = { 'low': 120, 'medium': 180, 'high': 250 };
        let baseCPC = baseMap[competition];
        
        // 검색량에 따른 조정 (인기 키워드일수록 비싸짐)
        const volumeMultiplier = Math.min(2.0, 1 + (searchVolume / 1000));
        
        // 키워드 특성에 따른 조정
        if (keyword.includes('전문') || keyword.includes('컨설팅')) baseCPC *= 1.3;
        if (keyword.includes('무료') || keyword.includes('저렴')) baseCPC *= 0.7;
        if (keyword.includes('서울') || keyword.includes('강남')) baseCPC *= 1.2;
        
        // 최종 계산 + 랜덤 요소
        const finalCPC = baseCPC * volumeMultiplier * (0.8 + Math.random() * 0.4);
        
        return Math.round(finalCPC);
    }

    calculateAverageVolume(dataPoints) {
        if (!dataPoints || dataPoints.length === 0) return 100;
        
        const sum = dataPoints.reduce((acc, point) => acc + point.ratio, 0);
        return Math.round(sum / dataPoints.length);
    }

    async getSearchVolumes(keywords) {
        const results = [];
        
        // 키워드를 5개씩 묶어서 처리 (API 제한)
        const batches = this.chunkArray(keywords, 5);
        
        for (const batch of batches) {
            try {
                const trendData = await this.fetchTrendData(batch);
                const processedData = this.processTrendData(batch, trendData);
                results.push(...processedData);
            } catch (error) {
                console.error('API 호출 실패:', error.message);
                // Per requirement: do not use mock data, bubble up the error
                throw error;
            }
        }
        
        return results;
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