# Story Bringer

3분 읽기 분량의 그래픽 노블을 생성하는 웹 애플리케이션입니다.

## 주요 기능

- **스토리 생성**: OpenAI GPT API (gpt-3.5-turbo)를 활용한 그래픽 노블 스토리 생성
- **이미지 생성**: Google Gemini API (gemini-3-pro-image-preview)를 활용한 1:1 비율 이미지 생성
  - 챕터별 개별 이미지 생성
  - 캐릭터 일관성 유지 (참조 이미지 기반)
  - 이미지 생성 가이드 설정 (예: 말 풍선 생성 금지)
  - 일일 생성 제한 (하루 최대 12개)
- **스토리 편집**: 챕터 추가/삭제, 텍스트 편집 기능
- **제목 추천**: GPT API를 활용한 최대 6가지 제목 추천 및 수동 편집
- **미리보기**: 데스크톱 모드 (16:9)로 그래픽 노블 미리보기
- **자동 저장**: 로컬 스토리지 기반 자동 저장 기능
- **PPT 내보내기**: 완성된 그래픽 노블을 PPT 파일로 다운로드
- **다국어 지원**: 한국어, 영어, 일본어 지원
  - 위치 기반 언어 자동 선택 (한국→한국어, 일본→일본어, 그 외→영어)
  - 사용자 언어 선택 기능
- **보안**: Vercel Functions를 통한 API 키 보호

## 기술 스택

### 프론트엔드
- **프레임워크**: React 19 + Vite 7
- **언어**: TypeScript
- **스타일링**: Tailwind CSS 3 (다크 모드 지원)
- **상태 관리**: React Context API
- **라우팅**: React Router v7
- **HTTP 클라이언트**: Axios

### 백엔드/서버리스
- **배포 플랫폼**: Vercel
- **서버리스 함수**: Vercel Functions (Node.js)
- **API 통합**:
  - OpenAI GPT API (스토리 생성)
  - Google Gemini API (이미지 생성)

### AI 모델
- **스토리 생성**: OpenAI GPT-3.5-turbo
- **이미지 생성**: Google Gemini 3 Pro Image Preview (Nano Banana Pro)

### 유틸리티
- **PPT 생성**: pptxgenjs
- **로컬 스토리지**: 브라우저 LocalStorage API
- **국제화**: 커스텀 i18n 시스템

## 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_MODEL=gemini-3-pro-image-preview
VITE_USE_VERCEL_FUNCTION=false  # 개발 환경에서 Vercel Functions 사용 여부
```

**API 키 발급 방법:**
- **OpenAI API**: https://platform.openai.com/api-keys
- **Gemini API**: https://aistudio.google.com (Google AI Studio에서 발급)

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`을 열어 확인하세요.

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 디렉토리에 생성됩니다.

### 배포

### Vercel 배포 (권장)

Vercel Functions를 사용하여 Gemini API 키를 안전하게 관리합니다.

자세한 배포 가이드는 [Vercel 배포 가이드](docs/Vercel_배포_가이드.md)를 참고하세요.

**빠른 배포 단계:**

1. GitHub에 프로젝트를 푸시합니다.
2. [Vercel](https://vercel.com)에 로그인하고 새 프로젝트를 생성합니다.
3. GitHub 저장소를 연결합니다.
4. 환경 변수를 Vercel 대시보드에서 설정합니다:
   - `GEMINI_API_KEY` (Vercel Functions용, 서버 사이드)
   - `GEMINI_MODEL` (선택사항, 기본값: gemini-3-pro-image-preview)
   - `VITE_OPENAI_API_KEY` (클라이언트용, 스토리 생성)
5. 배포를 시작합니다.

**중요**: 
- `GEMINI_API_KEY`는 Vercel Functions에서만 사용되므로 `VITE_` 접두사가 없습니다.
- 프로덕션 환경에서는 Vercel Functions를 통해 이미지 생성이 이루어집니다.

## 프로젝트 구조

```
프로젝트 루트/
├── api/
│   └── gemini/
│       └── generateImage.ts    # Vercel Functions (Gemini API 호출)
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── StoryInput/     # 스토리 입력 폼 (다국어 지원)
│   │   ├── StoryEditor/    # 스토리 편집기 (이미지 생성 가이드 포함)
│   │   ├── ImageGenerator/ # 이미지 생성기 (일일 제한, 참조 이미지)
│   │   ├── TitleRecommender/ # 제목 추천 (최대 6개, 수동 편집)
│   │   ├── Preview/        # 미리보기 (데스크톱 모드)
│   │   ├── Settings/       # 설정 (언어, 테마)
│   │   └── Layout/         # 레이아웃 (헤더, 푸터)
│   ├── pages/              # 페이지 컴포넌트
│   ├── services/           # API 서비스
│   │   ├── gptService.ts   # OpenAI GPT API
│   │   └── geminiService.ts # Gemini API (Vercel Functions 호출)
│   ├── hooks/              # 커스텀 훅
│   │   ├── useStory.ts     # 스토리 관리
│   │   ├── useImageGeneration.ts # 이미지 생성 (일일 제한 포함)
│   │   └── useAutoSave.ts  # 자동 저장
│   ├── contexts/           # React Context
│   │   └── AppContext.tsx  # 전역 상태 (테마, 언어)
│   ├── types/              # TypeScript 타입 정의
│   └── utils/              # 유틸리티 함수
│       ├── i18n.ts         # 다국어 지원
│       ├── storyParser.ts  # 스토리 파싱 (챕터 분할)
│       ├── imageGenerationLimit.ts # 일일 생성 제한
│       ├── pptGenerator.ts # PPT 생성
│       └── ...
└── docs/
    ├── Gemini_API_이미지_생성_구현_가이드.md
    └── Vercel_배포_가이드.md
```

## 핵심 구현 사항

### API 통합
- **OpenAI GPT API**: 스토리 생성 및 제목 추천
- **Google Gemini API**: 이미지 생성 (Vercel Functions를 통한 서버 사이드 호출)
- 에러 처리 및 재시도 로직
- 타임아웃 설정 (120초)

### 이미지 생성 최적화
- 참조 이미지를 통한 캐릭터 일관성 유지
- 이미지 생성 가이드를 프롬프트에 자동 포함
- 1:1 비율 이미지 생성
- Base64 인코딩 처리

### 사용자 경험
- 위치 기반 언어 자동 선택
- 로컬 스토리지 기반 설정 저장
- 일일 이미지 생성 제한으로 토큰 남용 방지
- 반응형 디자인 (Tailwind CSS)

## 주요 기술적 특징

### 1. 스토리 생성 및 파싱
- OpenAI GPT API를 통한 스토리 생성
- 자동 챕터 분할 (다양한 챕터 패턴 지원)
- 챕터별 개별 편집 및 삭제 기능
- 이미지 생성 가이드 설정 (전역 이미지 생성 규칙)

### 2. 이미지 생성 시스템
- **Gemini 3 Pro Image Preview** 모델 사용
- Vercel Functions를 통한 안전한 API 호출
- 캐릭터 일관성 유지 (첫 번째 이미지를 참조 이미지로 사용)
- 개별 텍스트 선택 기반 이미지 생성
- 일일 생성 제한 (하루 최대 12개, 로컬 스토리지 기반)
- 이미지 재생성 기능

### 3. 다국어 지원 (i18n)
- 한국어, 영어, 일본어 지원
- 위치 기반 언어 자동 선택:
  - 한국 접속 → 한국어
  - 일본 접속 → 일본어
  - 그 외 국가 → 영어
- 사용자 언어 선택 기능 (설정 메뉴)
- 모든 UI 텍스트 및 API 프롬프트 다국어 지원

### 4. 보안 및 배포
- **Vercel Functions**를 통한 API 키 보호
  - Gemini API 키는 서버 사이드에서만 사용
  - 클라이언트에 API 키 노출 방지
- 환경 변수 기반 설정
- CORS 처리

### 5. 데이터 관리
- 로컬 스토리지 기반 데이터 저장
- 자동 저장 기능
- 스토리 및 이미지 데이터 관리

## 사용 방법

1. **스토리 생성**: 스토리 라인, 등장 인물, 장르, 디자인 스타일 등을 입력하고 스토리를 생성합니다.
2. **스토리 편집**: 생성된 스토리를 챕터 단위로 편집하고, 이미지 생성 가이드를 설정할 수 있습니다.
3. **제목 추천**: 스토리 기반으로 최대 6가지 제목을 추천받고, 수동으로 편집할 수 있습니다.
4. **이미지 생성**: 각 챕터 텍스트를 선택하여 개별 이미지를 생성합니다. 표지 이미지도 선택할 수 있습니다.
5. **미리보기**: 데스크톱 모드 (16:9)로 완성된 그래픽 노블을 미리볼 수 있습니다.
6. **PPT 내보내기**: 완성된 그래픽 노블을 PPT 파일로 다운로드합니다.

## 라이선스

MIT
