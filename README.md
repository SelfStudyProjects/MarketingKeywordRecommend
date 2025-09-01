# Naver Ad Keyword Recommender

네이버 검색광고 키워드 추천 서비스는 React.js와 Node.js Express를 활용한 키워드 분석 및 추천 시스템입니다. 이 프로젝트는 특정 사업 도메인(현재: 속기)에서 네이버 파워링크 광고를 위한 최적의 키워드를 추천하여 광고 효율성을 극대화할 수 있도록 설계되었습니다.

## 목차
- [Naver Ad Keyword Recommender - 네이버 검색광고 키워드 추천 서비스](#naver-ad-keyword-recommender)
- [기능(MVP 단계)](#기능mvp-단계)
- [기술 스택](#기술-스택)
- [라이선스](#라이선스)
- [시스템 요구사항](#시스템-요구사항)
- [설치 및 실행](#설치-및-실행)
- [commands script file](#commands-script-file)
- [기타 커맨드](#기타-커맨드)
- [Mock Data](#mock-data)
- [폴더 구조](#폴더-구조)
- [API 설명](#api-설명)
- [프로젝트 아키텍처](#프로젝트-아키텍처)
- [개발 단계별 기능](#개발-단계별-기능)

## Naver Ad Keyword Recommender - 네이버 검색광고 키워드 추천 서비스

네이버 검색광고 키워드 추천 서비스는 사업체들이 효과적인 네이버 파워링크 광고를 위한 최적의 키워드를 찾을 수 있도록 도와주는 프로젝트입니다. 네이버 데이터랩과 키워드 분석 기술을 활용하여 클릭수가 많으면서 경쟁 입찰가가 낮은 키워드들을 추천합니다.

## 기능(MVP 단계)

### ✅ 기본 키워드 입력/분석 기능
- [x] 사용자가 3-5개의 기본 키워드를 입력할 수 있는 인터페이스
- [x] 입력된 키워드의 유효성 검사 및 자동 정제
- [x] 키워드 입력 히스토리 저장 (세션 기반)

### ✅ 자동 키워드 확장
- [x] 시드 키워드 기반 연관 키워드 자동 생성
- [x] 사업 도메인별 특화 키워드 확장 (현재: 속기 도메인)
- [x] 동의어, 유의어, 롱테일 키워드 생성

### ✅ 네이버 데이터랩 연동
- [x] 네이버 데이터랩 API를 통한 검색량 데이터 수집
- [x] 검색 트렌드 분석 및 시즌성 고려
- [x] 실시간 데이터 수집 및 캐싱

### ✅ 간단한 추천 알고리즘
- [x] 검색량 기반 키워드 점수 계산
- [x] 경쟁도 분석 및 가중치 적용
- [x] 상위 20개 키워드 추천 및 순위화

### ✅ 기본 웹 인터페이스
- [x] 직관적인 키워드 입력 화면
- [x] 추천 결과를 테이블 형태로 표시
- [x] 반응형 디자인 (모바일 친화적)

## 기술 스택

### 프론트엔드
- **React.js** (Create React App)
- **Material-UI** (컴포넌트 라이브러리)
- **Axios** (HTTP 클라이언트)
- **React Hooks** (상태 관리)

### 백엔드
- **Node.js** (런타임 환경)
- **Express.js** (웹 프레임워크)
- **Puppeteer** (웹 스크래핑)
- **Cors** (CORS 처리)

### 데이터 수집
- **네이버 데이터랩 API**
- **웹 스크래핑** (보조 데이터)
- **메모리 기반 캐싱**

### 배포
- **Firebase Hosting** (프론트엔드)
- **Render** (백엔드)

## 라이선스

Naver Ad Keyword Recommender 프로젝트는 MIT 라이선스를 따릅니다.

## 시스템 요구사항

### 환경 준비
- **하드웨어 요구 사항**: 일반적인 개발 환경 (4GB RAM 이상 권장)
- **소프트웨어 설치**: Node.js 16.x 이상, npm 8.x 이상

### 브라우저 지원
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 설치 및 실행

### 프로젝트 저장소 클론
```bash
git clone https://github.com/your-username/naver-keyword-recommender.git
cd naver-keyword-recommender
```

### 백엔드 설치 및 실행
```bash
cd backend
npm install
npm run dev
```

### 프론트엔드 설치 및 실행
```bash
cd frontend
npm install
npm start
```

### 환경 변수 설정
```bash
# backend/.env
PORT=5000
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

# frontend/.env
REACT_APP_API_URL=http://localhost:5000
```

## commands script file

`commands.sh` 파일을 실행하여 필요한 작업을 수행할 수 있습니다.

### 기본 실행 방법
- 개발 환경 실행: `./commands.sh dev`
- 프로덕션 빌드: `./commands.sh build`
- 테스트 실행: `./commands.sh test`

## 기타 커맨드

- **install**: 초기 패키지 설치를 수행합니다
- **dev**: 개발 서버를 실행합니다 (백엔드 + 프론트엔드)
- **build**: 프로덕션 빌드를 생성합니다
- **test**: API 테스트를 실행합니다
- **deploy**: 배포를 수행합니다
- **clean**: node_modules 및 빌드 파일을 정리합니다

## Mock Data

`mock_data` 커맨드를 사용하여 테스트용 키워드 데이터를 생성할 수 있습니다.

```bash
./commands.sh mock_data
```

Mock 데이터는 `backend/data/mock_keywords.json` 파일에 정의되어 있습니다.

## 트러블슈팅

### 일반적인 문제 해결

#### 1. 포트 충돌 오류
```
Error: listen EADDRINUSE: address already in use :::5000
```
**해결 방법:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

#### 2. npm install 실패
```
npm ERR! code ENOTFOUND
```
**해결 방법:**
- 인터넷 연결 확인
- npm 캐시 정리: `npm cache clean --force`
- 프록시 설정 확인

#### 3. CORS 오류
```
Access to XMLHttpRequest at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**해결 방법:**
- 백엔드에서 CORS 미들웨어가 제대로 설정되었는지 확인
- 프론트엔드에서 올바른 API URL 사용

#### 4. 빌드 실패
```
Module not found: Can't resolve 'axios'
```
**해결 방법:**
- 패키지 재설치: `rm -rf node_modules && npm install`
- package.json 확인

#### 5. 환경 변수 오류
```
REACT_APP_API_URL is not defined
```
**해결 방법:**
- `.env` 파일 생성 및 환경 변수 설정
- 서버 재시작

### 개발 환경별 문제

#### Windows
- PowerShell에서 실행 시 경로 문제: `./commands.sh` 대신 `bash commands.sh` 사용
- 권한 문제: 관리자 권한으로 터미널 실행

#### macOS
- Homebrew 설치 권장: Node.js 및 npm 설치용
- 포트 권한: 1024 이하 포트는 sudo 필요

#### Linux
- 권한 문제: `chmod +x commands.sh` 실행
- 의존성 문제: 시스템 패키지 설치 (예: `sudo apt-get install build-essential`)

### 디버깅 팁
- 로그 파일 확인: `development.log`
- 브라우저 개발자 도구의 Network 탭 확인
- 백엔드 로그: `cd backend && npm run dev` 실행 후 터미널 확인

## 기여 가이드

### 코드 기여 방법

1. **포크 및 클론**
```bash
git clone https://github.com/your-username/marketing-keyword-recommend.git
cd marketing-keyword-recommend
```

2. **개발 환경 설정**
```bash
./commands.sh setup
```

3. **브랜치 생성**
```bash
git checkout -b feature/your-feature-name
```

4. **코드 변경**
- 백엔드 변경: `backend/` 디렉토리
- 프론트엔드 변경: `frontend/` 디렉토리
- 문서 변경: `README.md`, `commands.sh`

5. **테스트 및 검증**
```bash
./commands.sh test
./commands.sh build
```

6. **커밋 및 푸시**
```bash
git add .
git commit -m "Add: [기능 설명]"
git push origin feature/your-feature-name
```

7. **풀 리퀘스트 생성**
- GitHub에서 풀 리퀘스트 생성
- 변경 사항 상세히 설명
- 관련 이슈 연결

### 코딩 표준

#### JavaScript/Node.js
- ESLint 규칙 준수
- async/await 사용
- 의미 있는 변수명 사용
- 주석으로 복잡한 로직 설명

#### React
- 함수형 컴포넌트와 Hooks 사용
- 컴포넌트 분리 및 재사용성 고려
- PropTypes 또는 TypeScript 사용 고려

#### Git 커밋 메시지
```
type: description

[선택적 본문]

[선택적 footer]
```

**타입 종류:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가
- `chore`: 빌드, 설정 변경

### 이슈 보고

버그 리포트 또는 기능 요청 시 다음 정보를 포함해주세요:

**버그 리포트:**
- 재현 단계
- 예상 동작
- 실제 동작
- 환경 정보 (OS, Node.js 버전 등)
- 스크린샷 (필요시)

**기능 요청:**
- 기능 설명
- 사용 사례
- 구현 제안 (선택적)

### 문의

질문이나 도움이 필요하시면:
- GitHub Issues 사용
- 이메일: your-email@example.com

### 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 기여 시 해당 라이선스에 동의하는 것으로 간주됩니다.

## 폴더 구조

```
📦naver-keyword-recommender
 ┣ 📂backend
 ┃ ┣ 📂routes
 ┃ ┃ ┗ 📜keywords.js
 ┃ ┣ 📂services
 ┃ ┃ ┣ 📜keywordExpander.js
 ┃ ┃ ┣ 📜naverDataLab.js
 ┃ ┃ ┗ 📜recommendationEngine.js
 ┃ ┣ 📂utils
 ┃ ┃ ┗ 📜helpers.js
 ┃ ┣ 📂data
 ┃ ┃ ┗ 📜mock_keywords.json
 ┃ ┣ 📜server.js
 ┃ ┣ 📜package.json
 ┃ ┗ 📜.env
 ┣ 📂frontend
 ┃ ┣ 📂src
 ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┣ 📜KeywordInput.js
 ┃ ┃ ┃ ┣ 📜ResultsTable.js
 ┃ ┃ ┃ ┗ 📜Loading.js
 ┃ ┃ ┣ 📂services
 ┃ ┃ ┃ ┗ 📜api.js
 ┃ ┃ ┣ 📂utils
 ┃ ┃ ┃ ┗ 📜constants.js
 ┃ ┃ ┣ 📜App.js
 ┃ ┃ ┗ 📜index.js
 ┃ ┣ 📜package.json
 ┃ ┗ 📜.env
 ┣ 📜commands.sh
 ┣ 📜README.md
 ┗ 📜.gitignore
```

## API 설명

### 백엔드 서비스

#### routes/keywords.js
- 키워드 분석 관련 API 엔드포인트를 정의
- POST `/api/keywords/analyze`: 키워드 분석 요청 처리
- GET `/api/keywords/history`: 분석 히스토리 조회

#### services/keywordExpander.js
- 입력된 시드 키워드를 기반으로 연관 키워드 생성
- 사업 도메인별 키워드 확장 로직
- 키워드 필터링 및 중복 제거

#### services/naverDataLab.js
- 네이버 데이터랩 API 연동
- 검색량 데이터 수집 및 가공
- API 호출 제한 및 에러 처리

#### services/recommendationEngine.js
- 키워드 점수 계산 알고리즘
- 검색량, 경쟁도 기반 추천 로직
- 결과 정렬 및 필터링

### 프론트엔드 컴포넌트

#### components/KeywordInput.js
- 키워드 입력 폼 컴포넌트
- 실시간 입력 검증
- 자동완성 기능 (선택사항)

#### components/ResultsTable.js
- 분석 결과 테이블 표시
- 정렬, 필터링 기능
- 결과 내보내기 옵션

#### services/api.js
- 백엔드 API 호출 로직
- HTTP 요청 처리 및 에러 핸들링
- 응답 데이터 가공

## 프로젝트 아키텍처

### 전체 시스템 구조
```
Client (React) ←→ Express Server ←→ Naver DataLab API
      ↓                ↓                    ↓
Firebase Hosting    Render           External Service
```

### 데이터 플로우
1. 사용자가 키워드 입력
2. 프론트엔드에서 백엔드로 API 호출
3. 백엔드에서 키워드 확장 및 데이터 수집
4. 추천 알고리즘 적용 후 결과 반환
5. 프론트엔드에서 결과 표시

## 개발 단계별 기능

### 1단계 (MVP - 진행 중)
- ✅ 기본 키워드 입력/분석 기능
- ✅ 네이버 데이터랩 연동
- ✅ 간단한 추천 알고리즘
- ✅ 기본 웹 인터페이스

### 2단계 (베타 - 계획 중)
- ⏳ 사용자 계정 관리
- ⏳ 분석 결과 저장/관리
- ⏳ 고급 경쟁 분석
- ⏳ 보고서 생성 기능

### 3단계 (정식 서비스 - 향후 계획)
- 🔄 다중 사업 도메인 지원
- 🔄 실시간 입찰가 모니터링
- 🔄 성과 추적 및 분석
- 🔄 자동화된 키워드 관리

---

## 푸터

**Naver Ad Keyword Recommender** - 효율적인 네이버 검색광고를 위한 키워드 추천 서비스

- [기능(MVP 단계)](#기능mvp-단계)
- [기술 스택](#기술-스택)
- [설치 및 실행](#설치-및-실행)
- [API 설명](#api-설명)
- [프로젝트 아키텍처](#프로젝트-아키텍처)

© 2025 Naver Ad Keyword Recommender. MIT License.

---

## 📋 구현 체크리스트

### 🔙 백엔드 구현 순서

- **[1일차]** server.js - 기본 Express 서버 구성
- **[2일차]** routes/keywords.js - API 엔드포인트 구현
- **[3일차]** services/keywordExpander.js - 키워드 확장 로직
- **[4일차]** services/naverDataLab.js - 데이터 수집 (Mock 데이터부터)
- **[5일차]** services/recommendationEngine.js - 추천 알고리즘
- **[6일차]** 에러 처리 및 테스트

### 🎨 프론트엔드 구현 순서

- **[7일차]** React 프로젝트 세팅 + App.js
- **[8일차]** components/keyword/KeywordInput.js
- **[9일차]** services/api.js + hooks/useKeywordAnalysis.js
- **[10일차]** components/keyword/ResultsTable.js
- **[11일차]** utils/formatters.js + Loading 컴포넌트
- **[12일차]** 스타일링 및 반응형 처리

### 🚀 통합 및 배포

- **[13일차]** 프론트엔드-백엔드 연동 테스트
- **[14일차]** Firebase + Render 배포 설정
