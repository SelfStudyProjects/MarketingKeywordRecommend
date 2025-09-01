#!/bin/bash
# PSEUDO CODE: 개발 편의 스크립트

# 로그 파일 설정
LOG_FILE="development.log"

# 로그 함수
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# 환경 체크 함수
check_environment() {
    log "🔍 환경 체크 중..."

    # Node.js 버전 확인
    if ! command -v node &> /dev/null; then
        log "❌ Node.js가 설치되어 있지 않습니다."
        exit 1
    fi
    NODE_VERSION=$(node --version)
    log "✅ Node.js 버전: $NODE_VERSION"

    # npm 버전 확인
    if ! command -v npm &> /dev/null; then
        log "❌ npm이 설치되어 있지 않습니다."
        exit 1
    fi
    NPM_VERSION=$(npm --version)
    log "✅ npm 버전: $NPM_VERSION"

    # 필수 버전 확인
    NODE_MAJOR=$(node --version | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 16 ]; then
        log "⚠️  Node.js 16 이상을 권장합니다. 현재 버전: $NODE_VERSION"
    fi

    log "✅ 환경 체크 완료"
}

FUNCTION main():
    command = $1

    # 환경 체크
    check_environment

    log "🚀 명령 실행: $command"

    CASE command IN
        "install"):
            install_dependencies()
            ;;
        "dev"):
            run_development_servers()
            ;;
        "build"):
            build_for_production()
            ;;
        "deploy"):
            deploy_to_production()
            ;;
        "test"):
            run_tests()
            ;;
        "mock_data"):
            generate_mock_data()
            ;;
        "clean"):
            clean_project()
            ;;
        *)
            show_help()
            ;;
    ESAC

FUNCTION install_dependencies():
    log "📦 패키지 설치 중..."

    # 백엔드 패키지 설치
    cd backend
    npm install
    cd ..

    # 프론트엔드 패키지 설치
    cd frontend
    npm install
    cd ..

    log "✅ 설치 완료!"

FUNCTION run_development_servers():
    log "🚀 개발 서버 실행 중..."

    # 백엔드 서버 실행 (백그라운드)
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..

    # 잠시 대기 (백엔드 서버 시작 시간)
    sleep 3

    # 프론트엔드 서버 실행
    cd frontend
    npm start

    # Ctrl+C 시 백엔드 프로세스도 종료
    trap "kill $BACKEND_PID; exit" INT
    wait

FUNCTION build_for_production():
    log "🏗️ 프로덕션 빌드 중..."

    # 프론트엔드 빌드
    cd frontend
    npm run build
    cd ..

    log "✅ 빌드 완료!"

FUNCTION deploy_to_production():
    log "🚀 배포 중..."

    # 프론트엔드 Firebase 배포
    cd frontend
    npm run build
    firebase deploy --only hosting
    cd ..

    # 백엔드 Render 배포 (Git push 기반)
    git add .
    git commit -m "Deploy: $(date)"
    git push origin main

    log "✅ 배포 완료!"

FUNCTION generate_mock_data():
    log "🎭 Mock 데이터 생성 중..."

    cd backend
    node -e "
        const mockData = {
            keywords: [
                { keyword: '속기', searchVolume: 1200, competition: 'medium', avgCPC: 180 },
                { keyword: '녹취', searchVolume: 800, competition: 'low', avgCPC: 150 },
                { keyword: '속기학원', searchVolume: 950, competition: 'high', avgCPC: 220 },
                { keyword: '실시간 속기', searchVolume: 600, competition: 'low', avgCPC: 140 },
                { keyword: '법정 속기', searchVolume: 400, competition: 'medium', avgCPC: 190 }
            ]
        };

        require('fs').writeFileSync('./data/mock_keywords.json', JSON.stringify(mockData, null, 2));
        console.log('Mock 데이터 생성 완료!');
    "
    cd ..

    log "✅ Mock 데이터 생성 완료"

FUNCTION show_help():
    echo "사용법: ./commands.sh [command]"
    echo ""
    echo "사용 가능한 명령어:"
    echo "  install    - 패키지 설치"
    echo "  dev        - 개발 서버 실행"
    echo "  build      - 프로덕션 빌드"
    echo "  deploy     - 배포 실행"
    echo "  test       - 테스트 실행"
    echo "  mock_data  - Mock 데이터 생성"
    echo "  clean      - 프로젝트 정리"

# 메인 함수 실행
main $1
