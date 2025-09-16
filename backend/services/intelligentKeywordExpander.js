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
    let all = [];

    // Collect candidates from Naver related queries that include the seed keyword.
    for (const kw of seedKeywords) {
      // Always include the seed itself as a candidate
      all.push({ keyword: kw, source: 'seed' });

      if (!this.naver || typeof this.naver.getRelatedQueries !== 'function') {
        // If no Naver integration, skip related collection (user requires API-only, so we will rely on naver)
        continue;
      }

      // Fetch related queries from Naver and only keep those that include the seed keyword
      const related = await this.naver.getRelatedQueries(kw);
      if (Array.isArray(related)) {
        for (const r of related) {
          const candidate = typeof r === 'string' ? r : (r.keyword || '');
          if (!candidate) continue;
          // Only accept suggestions that contain the seed keyword (to avoid standalone '온라인', etc.)
          if (candidate.includes(kw)) {
            all.push({ keyword: candidate, source: 'related' });
          }
        }
      }

      // Optionally include trend-based keywords but only if they contain the seed
      if (includeTrends && typeof this.naver.generateTrendBasedKeywords === 'function') {
        const trends = await this.naver.generateTrendBasedKeywords(kw);
        if (Array.isArray(trends)) {
          for (const t of trends) {
            if (t && t.keyword && t.keyword.includes(kw)) {
              all.push({ keyword: t.keyword, source: 'trend', searchVolume: t.searchVolume, trendScore: t.growthRate });
            }
          }
        }
      }
    }

  const unique = this._removeDuplicates(all.map(k => typeof k === 'string' ? { keyword: k } : k));

  // attach metrics using naver (if available) then rank
  const withScores = await this._attachMetrics(unique);
  const ranked = this._rankByRelevance(withScores);

  // 최종적으로 입력된 키워드 자체는 우선순위로 보존하되,
  // 결과는 최대 maxKeywords 까지만 반환 (중복 제거 및 네이버 기반 후보 우선)
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
    const out = [keyword];
    if (profile.intent === 'commercial') {
      out.push(`${keyword} 가격`, `${keyword} 견적`, `${keyword} 후기`);
    } else if (profile.intent === 'informational') {
      out.push(`${keyword} 방법`, `${keyword} 후기`, `${keyword} 팁`);
    } else {
      out.push(`${keyword} 추천`, `온라인 ${keyword}`);
    }
    return out.map(k=>({ keyword: k, source: 'profile' }));
  }

  _generateSemanticVariants(keyword) {
    // placeholder: 향후 동의어/사전/ML 연동 가능
    return [{ keyword: `${keyword} 추천`, source: 'semantic' }];
  }

  async _attachMetrics(items = []) {
    if (!this.naver?.getSearchVolumes) {
      return items.map(it => ({ ...it, searchVolume: it.searchVolume || 0, relevanceScore: it.relevanceScore ?? 0.5 }));
    }
    const kws = items.map(i=>i.keyword);
    const data = await this.naver.getSearchVolumes(kws).catch(()=>[]);
    return items.map(it => {
      const meta = (data || []).find(d=>d.keyword===it.keyword) || {};
      return { ...it, ...meta, relevanceScore: it.relevanceScore ?? (meta.searchVolume ? Math.min(1, meta.searchVolume/1000) : 0.5) };
    });
  }

  _rankByRelevance(items=[]) {
    return items.sort((a,b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  _removeDuplicates(items=[]) {
    const seen = new Set();
    return items.filter(i => {
      if (seen.has(i.keyword)) return false;
      seen.add(i.keyword);
      return true;
    });
  }

  _initCategoryPatterns(){ return {}; }
  _initCompetitionSignals(){ return {}; }

  trackKeywordPerformance(keyword, metrics) {
    this.performanceData.set(keyword, { ...(this.performanceData.get(keyword)||{}), ...metrics, ts: Date.now() });
  }
}

module.exports = IntelligentKeywordExpander;