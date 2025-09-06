const express = require('express');
const keywordExpander = require('../services/keywordExpander');
const naverDataLab = require('../services/naverDataLab');
const recommendationEngine = require('../services/recommendationEngine');

const router = express.Router();

router.post('/analyze', async (req, res) => {
    try {
        const { seedKeywords, businessDomain = '속기' } = req.body;
        
        if (!seedKeywords || seedKeywords.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: '키워드를 입력해주세요' 
            });
        }
        
        // 1. 키워드 확장
        console.log('🔍 키워드 확장 중...');
        const expandedKeywords = keywordExpander.expand(seedKeywords, businessDomain);
        
        // 2. 네이버 데이터 수집
        console.log('📊 데이터 수집 중...');
        const searchData = await naverDataLab.getSearchVolumes(expandedKeywords);
        
        // 3. 추천 알고리즘 적용
        console.log('🧮 추천 점수 계산 중...');
        const recommendations = recommendationEngine.calculate(searchData);
        
        // 4. 결과 반환 (상위 20개)
        res.json({
            success: true,
            inputKeywords: seedKeywords,
            expandedCount: expandedKeywords.length,
            recommendations: recommendations.slice(0, 20),
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('키워드 분석 오류:', error);
        res.status(500).json({ 
            success: false, 
            message: '분석 중 오류가 발생했습니다' 
        });
    }
});

module.exports = router;