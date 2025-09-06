const DOMAIN_PREFIXES = {
    '속기': ['전문', '실무', '법정', '회의', '실시간'],
    '카페': ['원두', '커피', '디저트', '브런치', '테이크아웃'],
    '병원': ['종합', '전문', '동물', '치과', '한방']
};

const DOMAIN_SUFFIXES = {
    '속기': ['학원', '교육', '강의', '과정', '자격증', '학습', '연습', '훈련'],
    '카페': ['메뉴', '가격', '리뷰', '추천', '예약', '배달'],
    '병원': ['진료', '예약', '상담', '검사', '치료', '수술']
};

const DEFAULT_PREFIXES = ['전문', '최고', '믿을만한', '추천'];
const DEFAULT_SUFFIXES = ['서비스', '업체', '전문가', '상담'];

module.exports = {
    DOMAIN_PREFIXES,
    DOMAIN_SUFFIXES,
    DEFAULT_PREFIXES,
    DEFAULT_SUFFIXES
};