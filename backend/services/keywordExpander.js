// PSEUDO CODE: 키워드 확장 서비스
// IMPORT constants from utils/constants
//
// CLASS KeywordExpander:
//     FUNCTION expand(seedKeywords, businessDomain):
//         allKeywords = []
//         FOR each keyword IN seedKeywords:
//             // 1. 접두사/접미사 조합
//             prefixed = this.addPrefixes(keyword, businessDomain)
//             suffixed = this.addSuffixes(keyword, businessDomain)
//             // 2. 연관 키워드 생성
//             related = this.generateRelated(keyword, businessDomain)
//             // 3. 롱테일 키워드 생성
//             longtail = this.generateLongtail(keyword)
//             allKeywords.push(...prefixed, ...suffixed, ...related, ...longtail)
//         // 4. 중복 제거 및 필터링
//         uniqueKeywords = this.removeDuplicates(allKeywords)
//         filteredKeywords = this.filterByQuality(uniqueKeywords)
//         RETURN filteredKeywords
//     FUNCTION addPrefixes(keyword, domain):
//         prefixes = constants.DOMAIN_PREFIXES[domain] || constants.DEFAULT_PREFIXES
//         RETURN prefixes.map(prefix => `${prefix} ${keyword}`)
//     FUNCTION addSuffixes(keyword, domain):
//         suffixes = constants.DOMAIN_SUFFIXES[domain] || constants.DEFAULT_SUFFIXES
//         RETURN suffixes.map(suffix => `${keyword} ${suffix}`)
//     FUNCTION generateRelated(keyword, domain):
//         // 1. 도메인별 연관어 사전에서 매칭
//         // 2. 유의어, 동의어 생성
//         // 3. 업계 전문 용어 조합
//         RETURN relatedKeywords
//     FUNCTION generateLongtail(keyword):
//         // 1. "keyword + 방법", "keyword + 가격" 등 패턴 생성
//         // 2. 질문형 키워드 생성 ("keyword 어떻게")
//         // 3. 지역명 조합 ("keyword + 서울")
//         RETURN longtailKeywords
//     FUNCTION removeDuplicates(keywords):
//         RETURN Array.from(new Set(keywords))
//     FUNCTION filterByQuality(keywords):
//         // 1. 너무 짧거나 긴 키워드 제거
//         // 2. 특수문자가 많은 키워드 제거
//         // 3. 의미없는 조합 제거
//         RETURN filteredKeywords
//     // [추가] 비즈니스 도메인 미지정 시 기본 처리
//     FUNCTION getDomainOrDefault(domain):
//         RETURN domain || 'default'
// EXPORT new KeywordExpander()
