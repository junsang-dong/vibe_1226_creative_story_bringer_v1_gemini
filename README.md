# Story Bringer

3분 읽기 분량의 그래픽 노블을 생성하는 웹 애플리케이션입니다.

## 주요 기능

- **스토리 생성**: GPT API를 활용한 그래픽 노블 스토리 생성
- **이미지 생성**: Gemini API (gemini-3-pro-image-preview)를 활용한 1:1 비율 이미지 생성 (표지 + 챕터별 이미지)
- **스토리 편집**: 챕터 추가/삭제, 텍스트 편집 기능
- **제목 추천**: GPT API를 활용한 최대 6가지 제목 추천
- **모바일 웹툰 스타일 리더**: 세로 스크롤, 이미지 중심의 읽기 경험
- **자동 저장**: 로컬 스토리지 기반 자동 저장 기능
- **PDF 내보내기**: 완성된 그래픽 노블을 PDF로 다운로드
- **소셜 공유**: Web Share API를 활용한 공유 기능

## 기술 스택

- **프레임워크**: React 18 + Vite
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: Zustand
- **라우팅**: React Router v6
- **PDF 생성**: jsPDF + html2canvas
- **HTTP 클라이언트**: Axios

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
│   │   ├── StoryInput/     # 스토리 입력 폼
│   │   ├── StoryEditor/    # 스토리 편집기
│   │   ├── ImageGenerator/ # 이미지 생성기
│   │   ├── TitleRecommender/ # 제목 추천
│   │   ├── Preview/        # 미리보기
│   │   └── ...
│   ├── pages/              # 페이지 컴포넌트
│   ├── services/           # API 서비스
│   │   ├── gptService.ts   # OpenAI GPT API
│   │   └── geminiService.ts # Gemini API (Vercel Functions 호출)
│   ├── hooks/              # 커스텀 훅
│   ├── types/              # TypeScript 타입 정의
│   └── utils/              # 유틸리티 함수
└── docs/
    ├── Gemini_API_이미지_생성_구현_가이드.md
    └── Vercel_배포_가이드.md
```

## 사용 방법

1. **스토리 생성**: 스토리 라인, 등장 인물, 장르 등을 입력하고 스토리를 생성합니다.
2. **스토리 편집**: 생성된 스토리를 챕터 단위로 편집할 수 있습니다.
3. **제목 추천**: 스토리 기반으로 3가지 제목을 추천받을 수 있습니다.
4. **이미지 생성**: 각 챕터에 맞는 이미지를 생성합니다 (표지 + 7장).
5. **읽기 모드**: 모바일 웹툰 스타일로 그래픽 노블을 읽을 수 있습니다.
6. **PDF 내보내기**: 완성된 그래픽 노블을 PDF로 다운로드합니다.

## 라이선스

MIT
