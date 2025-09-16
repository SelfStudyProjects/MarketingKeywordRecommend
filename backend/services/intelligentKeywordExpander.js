const axios = require('axios');

class IntelligentKeywordExpander {
  constructor({ naverDataLab } = {}) {
    this.naver = naverDataLab || null;
    this.performanceData = new Map();
    this.categoryPatterns = this._initCategoryPatterns();
    this.competitionSignals = this._initCompetitionSignals();
  }

  async expandKeywords(seedKeywords = [], options = {}) {
    const { maxKeywords = 20, includeTrends = true } = options;
    console.log('🚀 키워드 확장 시작:', seedKeywords);
    
    let all = [];

    for (const kw of seedKeywords) {
      console.log(`📝 처리 중인 키워드: ${kw}`);
      
      // 1. 시드 키워드 자체 포함
      all.push({ keyword: kw, source: 'seed', relevanceScore: 1.0 });

      // 2. 프로필 기반 키워드 생성 (하드코딩된 패턴)
      const profile = this._analyzeKeyword(kw);
      const profileKeywords = this._generateByProfile(kw, profile);
      all.push(...profileKeywords);

      // 3. 네이버 연관검색어 수집
      if (this.naver && typeof this.naver.getRelatedQueries === 'function') {
        try {
          console.log(`🔍 네이버 연관검색어 조회: ${kw}`);
          const related = await this.naver.getRelatedQueries(kw);
          console.log(`📊 연관검색어 수: ${related?.length || 0}`);
          
          if (Array.isArray(related) && related.length > 0) {
            for (const r of related) {
              const candidate = typeof r === 'string' ? r : (r.keyword || '');
              if (candidate && candidate !== kw) {
                // 연관검색어는 원래 키워드를 포함하지 않아도 됨 (실제 네이버 연관검색어 동작)
                all.push({ 
                  keyword: candidate, 
                  source: 'related',
                  relevanceScore: this._calculateRelevance(kw, candidate)
                });
              }
            }
          } else {
            console.log(`⚠️ 연관검색어 없음: ${kw}`);
          }
        } catch (error) {
          console.error(`❌ 연관검색어 조회 실패: ${kw}`, error.message);
        }
      }

      // 4. 트렌드 기반 키워드 (옵션)
      if (includeTrends && this.naver && typeof this.naver.generateTrendBasedKeywords === 'function') {
        try {
          const trends = await this.naver.generateTrendBasedKeywords(kw);
          if (Array.isArray(trends)) {
            for (const t of trends) {
              if (t && t.keyword && t.keyword !== kw) {
                all.push({ 
                  keyword: t.keyword, 
                  source: 'trend', 
                  searchVolume: t.searchVolume, 
                  trendScore: t.growthRate,
                  relevanceScore: this._calculateRelevance(kw, t.keyword)
                });
              }
            }
          }
        } catch (error) {
          console.error(`❌ 트렌드 키워드 생성 실패: ${kw}`, error.message);
        }
      }
    }

    console.log(`📝 전체 수집된 키워드 수: ${all.length}`);
    
    // 중복 제거
    const unique = this._removeDuplicates(all);
    console.log(`🔄 중복 제거 후 키워드 수: ${unique.length}`);

    // 메트릭 추가
    const withScores = await this._attachMetrics(unique);
    
    // 관련성으로 정렬
    const ranked = this._rankByRelevance(withScores);

    console.log(`✅ 최종 반환할 키워드 수: ${Math.min(ranked.length, maxKeywords)}`);
    return ranked.slice(0, maxKeywords);
  }

  _analyzeKeyword(keyword) {
    const intent = this._detectIntent(keyword);
    return { keyword, intent, length: keyword.length };
  }

  _detectIntent(keyword) {
    const commercial = ['가격','비용','구매','판매','견적','예약'];
    if (commercial.some(s=>keyword.includes(s))) return 'commercial';
    if (keyword.match(/방법|팁|가이드|후기|리뷰/)) return 'informational';
    return 'general';
  }

  _generateByProfile(keyword, profile) {
    const out = [];
    
    if (profile.intent === 'commercial') {
      out.push(`${keyword} 가격`, `${keyword} 견적`, `${keyword} 후기`, `${keyword} 비용`, `${keyword} 업체`);
    } else if (profile.intent === 'informational') {
      out.push(`${keyword} 방법`, `${keyword} 후기`, `${keyword} 팁`, `${keyword} 가이드`, `${keyword} 정보`);
    } else {
      out.push(`${keyword} 추천`, `온라인 ${keyword}`, `${keyword} 서비스`, `${keyword} 전문`, `${keyword} 상담`);
    }
    
    return out.map(k => ({ 
      keyword: k, 
      source: 'profile',
      relevanceScore: 0.8 // 프로필 기반은 높은 관련성
    }));
  }

  _generateSemanticVariants(keyword) {
    // 의미적 변형 생성
    const variants = [];
    
    // 지역 키워드 처리
    const locations = ['서울', '부산', '대구', '인천', '광주', '강남', '홍대'];
    if (!locations.some(loc => keyword.includes(loc))) {
      variants.push(`서울 ${keyword}`, `강남 ${keyword}`);
    }
    
    // 수식어 추가
    const modifiers = ['전문', '최고', '추천', '인기', '유명'];
    modifiers.forEach(mod => {
      if (!keyword.includes(mod)) {
        variants.push(`${mod} ${keyword}`);
      }
    });
    
    return variants.map(v => ({ 
      keyword: v, 
      source: 'semantic',
      relevanceScore: 0.7
    }));
  }

  _calculateRelevance(seedKeyword, candidateKeyword) {
    // 간단한 관련성 계산
    if (candidateKeyword === seedKeyword) return 1.0;
    
    // 공통 단어 수 계산
    const seedWords = seedKeyword.split(' ');
    const candidateWords = candidateKeyword.split(' ');
    
    let commonWords = 0;
    seedWords.forEach(word => {
      if (candidateWords.includes(word)) commonWords++;
    });
    
    // 포함 관계 확인
    const containsSeed = candidateKeyword.includes(seedKeyword);
    const seedContainsCandidate = seedKeyword.includes(candidateKeyword);
    
    if (containsSeed) return 0.9;
    if (seedContainsCandidate) return 0.8;
    
    return Math.min(1.0, commonWords / Math.max(seedWords.length, candidateWords.length));
  }

  async _attachMetrics(items = []) {
    console.log('📊 메트릭 추가 중...');
    
    if (!this.naver?.getSearchVolumes) {
      return items.map(it => ({ 
        ...it, 
        searchVolume: it.searchVolume || 0, 
        relevanceScore: it.relevanceScore ?? 0.5 
      }));
    }
    
    try {
      const kws = items.map(i => i.keyword);
      console.log(`🔍 검색량 조회 키워드 수: ${kws.length}`);
      
      const data = await this.naver.getSearchVolumes(kws);
      console.log(`📈 검색량 데이터 수: ${data?.length || 0}`);
      
      return items.map(it => {
        const meta = (data || []).find(d => d.keyword === it.keyword) || {};
        const finalRelevance = it.relevanceScore ?? (meta.searchVolume ? Math.min(1, meta.searchVolume/1000) : 0.5);
        
        return { 
          ...it, 
          ...meta, 
          relevanceScore: finalRelevance
        };
      });
    } catch (error) {
      console.error('❌ 메트릭 추가 실패:', error.message);
      return items.map(it => ({ 
        ...it, 
        searchVolume: it.searchVolume || 0, 
        relevanceScore: it.relevanceScore ?? 0.5 
      }));
    }
  }

  _rankByRelevance(items=[]) {
    return items.sort((a,b) => {
      // 먼저 관련성 점수로 정렬
      const scoreA = (a.relevanceScore || 0) * (a.searchVolume ? Math.log(a.searchVolume + 1) / 10 : 1);
      const scoreB = (b.relevanceScore || 0) * (b.searchVolume ? Math.log(b.searchVolume + 1) / 10 : 1);
      
      if (scoreB !== scoreA) return scoreB - scoreA;
      
      // 관련성이 같으면 검색량으로 정렬
      return (b.searchVolume || 0) - (a.searchVolume || 0);
    });
  }

  _removeDuplicates(items=[]) {
    const seen = new Set();
    return items.filter(i => {
      const key = i.keyword.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  _initCategoryPatterns(){ 
    return {
      medical: ['병원', '의원', '치료', '수술', '진료'],
      beauty: ['성형', '피부', '미용', '뷰티'],
      education: ['학원', '교육', '수업', '강의'],
      business: ['마케팅', '광고', '사업', '컨설팅']
    }; 
  }
  
  _initCompetitionSignals(){ 
    return {
      high: ['성형', '다이어트', '부동산', '보험', '대출'],
      medium: ['병원', '학원', '카페', '음식점'],
      low: ['후기', '정보', '가이드', '팁']
    }; 
  }

  trackKeywordPerformance(keyword, metrics) {
    this.performanceData.set(keyword, { 
      ...(this.performanceData.get(keyword)||{}), 
      ...metrics, 
      ts: Date.now() 
    });
  }
}

module.exports = IntelligentKeywordExpander;