const axios = require('axios');

class KeywordExpander {
    expand(seedKeywords, businessDomain = '속기') {
        let allKeywords = [];
        
        for (const keyword of seedKeywords) {
            // 1. 지능적 접두사/접미사 생성
            const prefixed = this.generateSmartPrefixes(keyword);
            const suffixed = this.generateSmartSuffixes(keyword);
            
            // 2. 의미적 연관 키워드
            const semantic = this.generateSemanticKeywords(keyword);
            
            // 3. 롱테일 키워드 (범용)
            const longtail = this.generateUniversalLongtail(keyword);
            
            // 4. 유사어/동의어
            const variants = this.generateVariants(keyword);
            
            allKeywords.push(...prefixed, ...suffixed, ...semantic, ...longtail, ...variants);
        }
        
        // 중복 제거 및 품질 필터링
        const uniqueKeywords = this.removeDuplicates(allKeywords);
        const qualityKeywords = this.filterByQuality(uniqueKeywords);
        
        return qualityKeywords;
    }
    
    generateSmartPrefixes(keyword) {
        // 키워드 특성에 따라 동적으로 접두사 선택
        const businessPrefixes = ['전문', '온라인', '맞춤', '프리미엄', '고급'];
        const servicePrefixes = ['24시간', '즉시', '빠른', '안전한', '신뢰할만한'];
        const educationPrefixes = ['기초', '실무', '고급', '속성', '집중'];
        const techPrefixes = ['스마트', 'AI', '자동', '디지털'];
        
        let selectedPrefixes = [];
        
        // 키워드 내용에 따라 적절한 접두사 선택
        if (this.isEducationRelated(keyword)) {
            selectedPrefixes.push(...educationPrefixes.slice(0, 3));
        }
        if (this.isServiceRelated(keyword)) {
            selectedPrefixes.push(...servicePrefixes.slice(0, 2));
        }
        if (this.isTechRelated(keyword)) {
            selectedPrefixes.push(...techPrefixes.slice(0, 2));
        }
        
        // 기본 비즈니스 접두사는 항상 포함
        selectedPrefixes.push(...businessPrefixes.slice(0, 2));
        
        return [...new Set(selectedPrefixes)].map(prefix => `${prefix} ${keyword}`);
    }
    
    generateSmartSuffixes(keyword) {
        // 범용적이고 실용적인 접미사들
        const businessSuffixes = ['업체', '서비스', '전문가', '컨설팅', '솔루션'];
        const educationSuffixes = ['교육', '강의', '과정', '학원', '자격증', '트레이닝'];
        const commercialSuffixes = ['가격', '비용', '견적', '할인', '이벤트'];
        const infoSuffixes = ['방법', '팁', '가이드', '매뉴얼', '추천'];
        const locationSuffixes = ['서울', '부산', '대구', '인천', '광주'];
        
        let selectedSuffixes = [];
        
        // 키워드 특성에 따라 접미사 선택
        if (this.isEducationRelated(keyword)) {
            selectedSuffixes.push(...educationSuffixes.slice(0, 4));
        } else {
            selectedSuffixes.push(...businessSuffixes.slice(0, 3));
        }
        
        selectedSuffixes.push(...commercialSuffixes.slice(0, 3));
        selectedSuffixes.push(...infoSuffixes.slice(0, 3));
        selectedSuffixes.push(...locationSuffixes.slice(0, 2));
        
        return [...new Set(selectedSuffixes)].map(suffix => `${keyword} ${suffix}`);
    }
    
    generateSemanticKeywords(keyword) {
        // 의미적으로 연관된 키워드 생성
        const semanticMap = {
            // 비즈니스 관련
            '마케팅': ['광고', 'SNS마케팅', '브랜딩', '프로모션', '세일즈', '고객유치'],
            '펫푸드': ['강아지사료', '고양이사료', '애완동물영양', '프리미엄사료', '자연사료'],
            '카페': ['커피숍', '원두', '에스프레소', '라떼', '카페인테리어', '디저트'],
            '병원': ['의료진', '진료', '건강검진', '의료서비스', '클리닉'],
            
            // 기술 관련
            '개발': ['프로그래밍', '코딩', '웹개발', '앱개발', '소프트웨어'],
            'AI': ['인공지능', '머신러닝', '딥러닝', '자동화', '챗봇'],
            
            // 교육 관련
            '교육': ['학습', '강의', '온라인교육', 'e러닝', '스킬업'],
            '영어': ['토익', '토플', '회화', '문법', '발음', '번역']
        };
        
        // 직접 매핑이 없으면 키워드 분석해서 연관어 생성
        if (semanticMap[keyword]) {
            return semanticMap[keyword];
        }
        
        return this.generateByWordAnalysis(keyword);
    }
    
    generateByWordAnalysis(keyword) {
        // 키워드 분석을 통한 연관어 생성
        const results = [];
        
        // 단어 길이에 따른 전략
        if (keyword.length <= 3) {
            // 짧은 키워드: 구체적 확장
            results.push(
                `${keyword}전문가`,
                `${keyword}상담`,
                `${keyword}정보`,
                `${keyword}추천`,
                `${keyword}리뷰`
            );
        } else {
            // 긴 키워드: 간소화 및 변형
            const simplified = keyword.slice(0, 2);
            results.push(
                `${simplified}전문`,
                `${simplified}서비스`,
                `프로${simplified}`
            );
        }
        
        return results;
    }
    
    generateUniversalLongtail(keyword) {
        // 모든 키워드에 적용 가능한 롱테일 패턴
        const questionPatterns = [
            `${keyword} 어떻게`,
            `${keyword} 왜`,
            `${keyword} 언제`,
            `${keyword} 어디서`
        ];
        
        const comparisonPatterns = [
            `${keyword} 비교`,
            `${keyword} 차이점`,
            `${keyword} vs`,
            `${keyword} 순위`
        ];
        
        const actionPatterns = [
            `${keyword} 시작하기`,
            `${keyword} 배우기`,
            `${keyword} 선택하기`,
            `${keyword} 구매하기`
        ];
        
        return [
            ...questionPatterns.slice(0, 2),
            ...comparisonPatterns.slice(0, 2),
            ...actionPatterns.slice(0, 2)
        ];
    }
    
    generateVariants(keyword) {
        // 유사어, 줄임말, 변형어 생성
        const variants = [];
        
        // 영어-한글 변형
        const englishKoreanMap = {
            '마케팅': ['marketing', '마켓팅'],
            '커피': ['coffee', '코피'],
            '펫푸드': ['petfood', '애완동물사료'],
            '헬스': ['health', '건강']
        };
        
        if (englishKoreanMap[keyword]) {
            variants.push(...englishKoreanMap[keyword]);
        }
        
        // 줄임말 생성 (3글자 이상인 경우)
        if (keyword.length >= 3) {
            variants.push(keyword.slice(0, 2));
        }
        
        return variants;
    }
    
    // 헬퍼 메서드들
    isEducationRelated(keyword) {
        const educationKeywords = ['교육', '학습', '강의', '과정', '자격증', '학원', '공부'];
        return educationKeywords.some(edu => keyword.includes(edu));
    }
    
    isServiceRelated(keyword) {
        const serviceKeywords = ['서비스', '상담', '관리', '케어', '지원'];
        return serviceKeywords.some(service => keyword.includes(service));
    }
    
    isTechRelated(keyword) {
        const techKeywords = ['AI', '개발', '프로그램', '시스템', '앱', '웹'];
        return techKeywords.some(tech => keyword.includes(tech));
    }
    
    removeDuplicates(keywords) {
        return Array.from(new Set(keywords));
    }
    
    filterByQuality(keywords) {
        return keywords.filter(keyword => 
            keyword.length >= 2 && 
            keyword.length <= 25 &&
            !keyword.includes('undefined') &&
            !keyword.includes('null') &&
            !/\s{2,}/.test(keyword) && // 연속 공백 제거
            !keyword.startsWith(' ') && // 앞뒤 공백 제거
            !keyword.endsWith(' ')
        );
    }
}

module.exports = new KeywordExpander();