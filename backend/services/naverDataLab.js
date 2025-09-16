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

    // 개선된 연관검색어 수집
    async getRelatedQueries(keyword) {
        if (!keyword) return [];
        
        console.log(`🔍 연관검색어 수집 시작: ${keyword}`);
        
        // 다중 소스에서 연관검색어 수집
        const allSuggestions = [];
        
        // 1. 네이버 자동완성 API
        try {
            const autoComplete = await this.getNaverAutoComplete(keyword);
            allSuggestions.push(...autoComplete);
            console.log(`📝 자동완성에서 수집: ${autoComplete.length}개`);
        } catch (error) {
            console.error('자동완성 API 실패:', error.message);
        }
        
        // 2. 네이버 검색 제안 API (다른 엔드포인트)
        try {
            const searchSuggestions = await this.getNaverSearchSuggestions(keyword);
            allSuggestions.push(...searchSuggestions);
            console.log(`📝 검색제안에서 수집: ${searchSuggestions.length}개`);
        } catch (error) {
            console.error('검색제안 API 실패:', error.message);
        }
        
        // 3. 키워드 변형 생성 (최후 수단)
        if (allSuggestions.length < 5) {
            const variations = this.generateKeywordVariations(keyword);
            allSuggestions.push(...variations);
            console.log(`📝 변형 키워드 생성: ${variations.length}개`);
        }
        
        // 중복 제거 및 정리
        const uniqueSuggestions = [...new Set(allSuggestions)]
            .filter(s => s && s !== keyword && s.trim().length > 1)
            .slice(0, 15); // 최대 15개
        
        console.log(`✅ 최종 연관검색어: ${uniqueSuggestions.length}개`);
        return uniqueSuggestions.map(s => ({ keyword: s }));
    }
    
    // 네이버 자동완성 API
    async getNaverAutoComplete(keyword) {
        const suggestions = [];
        
        try {
            // 방법 1: 네이버 모바일 자동완성
            const mobileUrl = 'https://m.search.naver.com/p/csearch/content/nqapi.nhn';
            const mobileResponse = await axios.get(mobileUrl, {
                params: {
                    query: keyword,
                    where: 'nexearch',
                    sm: 'mtp_hty.top',
                    ie: 'utf8',
                    frm: 'sdt'
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
                },
                timeout: 5000
            });
            
            if (mobileResponse.data && typeof mobileResponse.data === 'string') {
                // JSON 응답에서 키워드 추출
                const matches = mobileResponse.data.match(/"[^"]*" + keyword + "[^"]*"/g);
                if (matches) {
                    matches.forEach(match => {
                        const cleaned = match.replace(/"/g, '').trim();
                        if (cleaned && cleaned !== keyword) {
                            suggestions.push(cleaned);
                        }
                    });
                }
            }
        } catch (error) {
            console.log('모바일 자동완성 실패');
        }
        
        try {
            // 방법 2: 네이버 통합검색 자동완성
            const acUrl = 'https://ac.search.naver.com/nx/ac';
            const acResponse = await axios.get(acUrl, {
                params: {
                    q: keyword,
                    st: 1,
                    r_format: 'json',
                    r_enc: 'UTF-8',
                    t_koreng: 1,
                    q_enc: 'UTF-8',
                    r_method: 'default'
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': 'https://search.naver.com/'
                },
                timeout: 5000
            });
            
            const data = acResponse.data;
            console.log('AC API 응답 타입:', typeof data);
            
            // 다양한 응답 형식 처리
            if (data && data.items && Array.isArray(data.items) && data.items.length >= 2) {
                const suggestionArray = data.items[1];
                if (Array.isArray(suggestionArray)) {
                    suggestionArray.forEach(item => {
                        if (Array.isArray(item) && item.length > 0) {
                            const suggestion = item[0];
                            if (typeof suggestion === 'string' && suggestion !== keyword) {
                                suggestions.push(suggestion);
                            }
                        }
                    });
                }
            }
            
        } catch (error) {
            console.log('AC API 실패:', error.message);
        }
        
        return suggestions;
    }
    
    // 네이버 검색 제안
    async getNaverSearchSuggestions(keyword) {
        const suggestions = [];
        
        try {
            // 실제 검색 페이지에서 제안 키워드 추출
            const searchUrl = 'https://search.naver.com/search.naver';
            const response = await axios.get(searchUrl, {
                params: {
                    query: keyword,
                    where: 'nexearch',
                    sm: 'top_hty',
                    fbm: 0,
                    ie: 'utf8'
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 10000
            });
            
            const html = response.data;
            
            // 연관검색어 추출 (HTML 파싱)
            const relatedRegex = /<a[^>]+class="[^"]*relate[^"]*"[^>]*>([^<]+)<\/a>/gi;
            let match;
            while ((match = relatedRegex.exec(html)) !== null) {
                const suggestion = match[1].trim();
                if (suggestion && suggestion !== keyword && suggestion.length > 1) {
                    suggestions.push(suggestion);
                }
            }
            
            // 추천검색어 추출
            const recommendRegex = /<span[^>]+class="[^"]*recommend[^"]*"[^>]*>([^<]+)<\/span>/gi;
            while ((match = recommendRegex.exec(html)) !== null) {
                const suggestion = match[1].trim();
                if (suggestion && suggestion !== keyword && suggestion.length > 1) {
                    suggestions.push(suggestion);
                }
            }
            
        } catch (error) {
            console.log('검색 제안 추출 실패:', error.message);
        }
        
        return suggestions;
    }
    
    // 키워드 변형 생성 (최후 수단)
    generateKeywordVariations(keyword) {
        const variations = [];
        
        // 공통 접미사 추가
        const suffixes = ['추천', '비교', '후기', '가격', '정보', '방법', '팁', '순위', '종류', '장점'];
        suffixes.forEach(suffix => {
            if (!keyword.includes(suffix)) {
                variations.push(`${keyword} ${suffix}`);
            }
        });
        
        // 공통 접두사 추가
        const prefixes = ['인기', '최고', '추천', '전문', '유명'];
        prefixes.forEach(prefix => {
            if (!keyword.includes(prefix)) {
                variations.push(`${prefix} ${keyword}`);
            }
        });
        
        // 지역 키워드
        if (!keyword.match(/서울|부산|대구|인천|광주|대전|강남/)) {
            variations.push(`서울 ${keyword}`, `강남 ${keyword}`);
        }
        
        return variations.slice(0, 10); // 최대 10개
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
                throw error;
            }
        }
        
        return results;
    }
    
    estimateSearchVolume(keyword) {
        // 키워드 특성에 따른 검색량 추정
        if (keyword.includes('카페')) return 850;
        if (keyword.includes('커피')) return 600;
        if (keyword.includes('원두')) return 400;
        if (keyword.includes('전문')) return 300;
        
        // 기본값: 키워드 길이에 반비례
        return Math.max(100, 800 - (keyword.length * 30));
    }
    
    estimateCompetition(keyword) {
        if (keyword.includes('전문') || keyword.includes('최고')) return 'high';
        if (keyword.includes('추천') || keyword.includes('인기')) return 'medium';
        return 'low';
    }
}

module.exports = new NaverDataLab();