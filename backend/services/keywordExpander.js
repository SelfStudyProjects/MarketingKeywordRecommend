// 실제 구현 코드
const { DOMAIN_PREFIXES, DOMAIN_SUFFIXES, DEFAULT_PREFIXES, DEFAULT_SUFFIXES } = require('../utils/constants');

class KeywordExpander {
    expand(seedKeywords, businessDomain = '속기') {
        let allKeywords = [];
        
        for (const keyword of seedKeywords) {
            // 1. 접두사/접미사 조합
            const prefixed = this.addPrefixes(keyword, businessDomain);
            const suffixed = this.addSuffixes(keyword, businessDomain);
            
            // 2. 연관 키워드 생성
            const related = this.generateRelated(keyword, businessDomain);
            
            // 3. 롱테일 키워드 생성
            const longtail = this.generateLongtail(keyword);
            
            allKeywords.push(...prefixed, ...suffixed, ...related, ...longtail);
        }
        
        // 4. 중복 제거 및 필터링
        const uniqueKeywords = this.removeDuplicates(allKeywords);
        const filteredKeywords = this.filterByQuality(uniqueKeywords);
        
        return filteredKeywords;
    }
    
    addPrefixes(keyword, domain) {
        const prefixes = DOMAIN_PREFIXES[domain] || DEFAULT_PREFIXES;
        return prefixes.map(prefix => `${prefix} ${keyword}`);
    }
    
    addSuffixes(keyword, domain) {
        const suffixes = DOMAIN_SUFFIXES[domain] || DEFAULT_SUFFIXES;
        return suffixes.map(suffix => `${keyword} ${suffix}`);
    }
    
    generateRelated(keyword, domain) {
        // 속기 도메인 특화 연관어
        const domainRelated = {
            '속기': ['속기사', '타이핑', '받아쓰기', '문서작성', '회의록'],
            '녹취': ['녹음', '음성파일', '회의녹취', '인터뷰'],
            '속기학원': ['속기교육', '속기강의', '속기과정', '속기자격증']
        };
        
        return domainRelated[keyword] || [];
    }
    
    generateLongtail(keyword) {
        const patterns = ['방법', '가격', '비용', '업체', '서비스', '전문', '추천'];
        return patterns.map(pattern => `${keyword} ${pattern}`);
    }
    
    removeDuplicates(keywords) {
        return Array.from(new Set(keywords));
    }
    
    filterByQuality(keywords) {
        return keywords.filter(keyword => 
            keyword.length >= 2 && 
            keyword.length <= 30 &&
            !keyword.includes('undefined') &&
            !keyword.includes('null')
        );
    }
}

module.exports = new KeywordExpander();