const express = require('express');
const router = express.Router();

// 서비스
const KeywordExpander = require('../services/keywordExpander');
const NaverDataLab = require('../services/naverDataLab');
const recommendationEngine = require('../services/recommendationEngine');
const IntelligentKeywordExpander = require('../services/intelligentKeywordExpander');

const naverDataLab = new NaverDataLab();
const intelligentExpander = new IntelligentKeywordExpander({ naverDataLab });

// POST /api/keywords/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { seedKeywords = [], businessDomain = '속기', maxKeywords = 50 } = req.body;
    if (!seedKeywords || seedKeywords.length === 0) {
      return res.status(400).json({ success: false, message: '키워드를 입력해주세요' });
    }

    console.log('🔍 키워드 확장 중...');
    const expanded = await intelligentExpander.expandKeywords(seedKeywords, { maxKeywords, includeTrends: true });

    console.log('🧮 추천 점수 계산 중...');
    // recommendationEngine expects keyword data with searchVolume/competition/etc.
    const enriched = await naverDataLab.getSearchVolumes(expanded.map(e => e.keyword || e));
    const recommendations = recommendationEngine.calculate(enriched).slice(0, Math.min(50, enriched.length));

    res.json({
      success: true,
      inputKeywords: seedKeywords,
      expandedCount: expanded.length,
      recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('키워드 분석 오류:', err);
    res.status(500).json({ success: false, message: '분석 중 오류가 발생했습니다' });
  }
});

module.exports = router;