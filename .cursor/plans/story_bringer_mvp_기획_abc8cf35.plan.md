---
name: Story Bringer MVP 기획
overview: React/Vite 기반 그래픽 노블 생성 웹앱 MVP. GPT API로 스토리 생성, Nano Banana API로 이미지 생성, 모바일 웹툰 스타일 뷰어, PDF 저장 및 소셜 공유 기능 포함.
todos:
  - id: setup-vite
    content: React + Vite + TypeScript 프로젝트 초기 설정 및 필수 패키지 설치
    status: completed
  - id: setup-deps
    content: 필수 의존성 설치 (axios, react-router-dom, jsPDF, html2canvas, tailwindcss 등)
    status: completed
    dependencies:
      - setup-vite
  - id: setup-env
    content: 환경 변수 설정 파일 생성 (.env.example, .env.local 템플릿)
    status: completed
    dependencies:
      - setup-vite
  - id: types
    content: 스토리 데이터 모델 타입 정의 (Story, Chapter, Image, UserInput)
    status: completed
    dependencies:
      - setup-vite
  - id: story-input
    content: 스토리 입력 컴포넌트 구현 (스토리 라인, 등장 인물, 비슷한 작품 입력 폼)
    status: completed
    dependencies:
      - types
  - id: file-upload
    content: 텍스트 파일 업로드 기능 구현 (drag & drop 지원)
    status: completed
    dependencies:
      - story-input
  - id: style-selector
    content: 장르, 디자인 스타일, 아티스트/디렉터 선택 UI 구현
    status: completed
    dependencies:
      - story-input
  - id: gpt-service
    content: GPT API 서비스 구현 (OpenAI API 통합)
    status: completed
    dependencies:
      - types
  - id: story-generation
    content: 사용자 입력 기반 스토리 생성 로직 구현
    status: completed
    dependencies:
      - gpt-service
      - story-input
  - id: story-parsing
    content: 생성된 스토리를 챕터 단위로 파싱하는 로직 구현
    status: completed
    dependencies:
      - story-generation
  - id: nano-banana-service
    content: Nano Banana API 서비스 구현 (이미지 생성 API 통합)
    status: completed
    dependencies:
      - types
  - id: image-generator
    content: 이미지 생성 컴포넌트 구현 (표지 + 7장, 9:16 비율)
    status: completed
    dependencies:
      - nano-banana-service
  - id: image-ratio
    content: 9:16 비율 이미지 생성 및 검증 로직 구현
    status: completed
    dependencies:
      - image-generator
  - id: image-editing
    content: 이미지 교체 및 재생성 기능 구현
    status: completed
    dependencies:
      - image-generator
  - id: story-editor
    content: 스토리 편집 컴포넌트 구현 (텍스트 편집, 챕터 추가/삭제)
    status: completed
    dependencies:
      - story-parsing
  - id: title-recommender
    content: 제목 추천 컴포넌트 구현 (GPT API로 3개 제목 생성)
    status: completed
    dependencies:
      - story-generation
  - id: reader-component
    content: 모바일 웹툰 스타일 리더 컴포넌트 구현
    status: completed
    dependencies:
      - image-generator
      - story-editor
  - id: reader-styling
    content: 모바일 최적화 스타일링 (9:16 이미지 풀스크린)
    status: completed
    dependencies:
      - reader-component
  - id: reader-navigation
    content: 페이지 네비게이션 구현 (이전/다음, 진행률 표시)
    status: completed
    dependencies:
      - reader-component
  - id: storage-service
    content: 로컬 스토리지 서비스 구현 (IndexedDB 또는 localStorage)
    status: completed
    dependencies:
      - types
  - id: auto-save
    content: 자동 저장 기능 구현 (debounce 적용)
    status: completed
    dependencies:
      - storage-service
  - id: load-project
    content: 저장된 프로젝트 불러오기 기능 구현
    status: completed
    dependencies:
      - storage-service
  - id: pdf-generator
    content: PDF 생성 유틸리티 구현 (jsPDF + html2canvas)
    status: completed
    dependencies:
      - reader-component
  - id: pdf-layout
    content: 그래픽 노블 레이아웃으로 PDF 생성 (이미지 + 텍스트)
    status: completed
    dependencies:
      - pdf-generator
  - id: pdf-download
    content: PDF 로컬 다운로드 기능 구현
    status: completed
    dependencies:
      - pdf-layout
  - id: social-share
    content: 소셜 공유 기능 구현 (Web Share API)
    status: completed
    dependencies:
      - reader-component
  - id: routing
    content: React Router 설정 (/create, /edit/:id, /read/:id)
    status: completed
    dependencies:
      - story-input
      - story-editor
      - reader-component
  - id: loading-states
    content: API 호출 중 로딩 상태 표시 구현
    status: completed
    dependencies:
      - gpt-service
      - nano-banana-service
  - id: error-handling
    content: 에러 처리 및 사용자 피드백 구현
    status: completed
    dependencies:
      - gpt-service
      - nano-banana-service
  - id: responsive
    content: 반응형 디자인 구현 (모바일 우선)
    status: completed
    dependencies:
      - reader-component
      - story-input
  - id: vercel-config
    content: Vercel 배포 설정 (vercel.json)
    status: completed
    dependencies:
      - setup-env
  - id: env-docs
    content: 환경 변수 설정 가이드 문서화
    status: completed
    dependencies:
      - setup-env
---

# Story Bringer MVP 개발 계획

## 프로젝트 구조

```
vibe_1226_creative_story_bringer_v1/
├── public/
├── src/
│   ├── components/
│   │   ├── StoryInput/
│   │   ├── StoryEditor/
│   │   ├── ImageGenerator/
│   │   ├── TitleRecommender/
│   │   ├── Reader/
│   │   └── PDFExporter/
│   ├── pages/
│   │   ├── CreatePage.tsx
│   │   ├── EditPage.tsx
│   │   └── ReadPage.tsx
│   ├── services/
│   │   ├── gptService.ts
│   │   ├── nanoBananaService.ts
│   │   └── storageService.ts
│   ├── hooks/
│   │   ├── useStory.ts
│   │   └── useImageGeneration.ts
│   ├── types/
│   │   └── story.ts
│   ├── utils/
│   │   ├── pdfGenerator.ts
│   │   └── imageUtils.ts
│   ├── App.tsx
│   └── main.tsx
├── .env.local
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

## 핵심 기능 구현 계획

### 1. 프로젝트 초기 설정

- [setup-vite] React + Vite + TypeScript 프로젝트 생성
- [setup-deps] 필수 패키지 설치 (axios, react-router-dom, jsPDF, html2canvas, tailwindcss 등)
- [setup-env] 환경 변수 설정 (.env.example, .env.local 템플릿)

### 2. 데이터 모델 정의

- [types] `src/types/story.ts`에 Story, Chapter, Image, UserInput 타입 정의
- 스토리 구조: 제목, 장르, 챕터 배열, 이미지 배열, 메타데이터

### 3. 스토리 입력 컴포넌트

- [story-input] `StoryInput` 컴포넌트: 스토리 라인, 등장 인물, 비슷한 작품 입력 폼
- [file-upload] 텍스트 파일 업로드 기능 (drag & drop 지원)
- [style-selector] 장르, 디자인 스타일, 아티스트/디렉터 선택 UI

### 4. GPT API 통합

- [gpt-service] `gptService.ts`: OpenAI API 호출 로직
- [story-generation] 사용자 입력을 프롬프트로 변환하여 스토리 생성
- [story-parsing] 생성된 스토리를 챕터 단위로 파싱

### 5. 이미지 생성 시스템

- [nano-banana-service] `nanoBananaService.ts`: Nano Banana API 통합
- [image-generator] `ImageGenerator` 컴포넌트: 표지 + 7장 이미지 생성 UI
- [image-ratio] 9:16 비율 이미지 생성 및 검증
- [image-editing] 이미지 교체 및 재생성 기능

### 6. 스토리 편집 기능

- [story-editor] `StoryEditor` 컴포넌트: 텍스트 편집, 챕터 추가/삭제
- [image-editor] 이미지별 스토리 연결 및 수정

### 7. 제목 추천 시스템

- [title-recommender] `TitleRecommender` 컴포넌트
- [title-api] GPT API로 스토리 기반 제목 3개 생성

### 8. 모바일 웹툰 스타일 리더

- [reader-component] `Reader` 컴포넌트: 세로 스크롤, 이미지 중심 레이아웃
- [reader-styling] 모바일 최적화 스타일링 (9:16 이미지 풀스크린)
- [reader-navigation] 페이지 네비게이션 (이전/다음, 진행률 표시)

### 9. 로컬 스토리지 저장

- [storage-service] `storageService.ts`: IndexedDB 또는 localStorage 활용
- [auto-save] 자동 저장 기능 (debounce 적용)
- [load-project] 저장된 프로젝트 불러오기

### 10. PDF 생성 및 다운로드

- [pdf-generator] `pdfGenerator.ts`: jsPDF + html2canvas 활용
- [pdf-layout] 그래픽 노블 레이아웃으로 PDF 생성 (이미지 + 텍스트)
- [pdf-download] 로컬 다운로드 기능

### 11. 소셜 공유 기능

- [social-share] Web Share API 활용 (모바일)
- [social-fallback] 데스크톱: 클립보드 복사, 이미지 다운로드 옵션

### 12. 라우팅 및 페이지 구성

- [routing] React Router 설정: /create, /edit/:id, /read/:id
- [navigation] 페이지 간 네비게이션 및 상태 관리

### 13. UI/UX 개선

- [loading-states] API 호출 중 로딩 상태 표시
- [error-handling] 에러 처리 및 사용자 피드백
- [responsive] 반응형 디자인 (모바일 우선)

### 14. 배포 준비

- [vercel-config] Vercel 배포 설정 (vercel.json)
- [env-docs] 환경 변수 설정 가이드 문서화
- [github-setup] GitHub 저장소 초기화 및 배포 워크플로우

## 기술 스택 상세

- **프레임워크**: React 18 + Vite
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: Context API 또는 Zustand
- **라우팅**: React Router v6
- **PDF 생성**: jsPDF + html2canvas
- **HTTP 클라이언트**: Axios
- **이미지 처리**: Canvas API

## API 통합 포인트

### GPT API

- 엔드포인트: `https://api.openai.com/v1/chat/completions`
- 모델: `gpt-4` 또는 `gpt-3.5-turbo`
- 프롬프트 구조: 사용자 입력 + 스토리 생성 지시사항

### Nano Banana API

- 일반적인 이미지 생성 API 패턴으로 구현
- 프롬프트 기반 이미지 생성
- 9:16 비율 지정 파라미터
- 비동기 이미지 생성 처리

## 주요 파일별 구현 내용

### `src/types/story.ts`

스토리 데이터 구조 정의 (제목, 챕터, 이미지, 메타데이터)

### `src/services/gptService.ts`

GPT API 호출 및 스토리 생성 로직

### `src/services/nanoBananaService.ts`

Nano Banana API 호출 및 이미지 생성 로직

### `src/services/storageService.ts`

로컬 스토리지 저장/불러오기 (IndexedDB 권장)

### `src/components/Reader/Reader.tsx`

모바일 웹툰 스타일 읽기 뷰어 컴포넌트

### `src/utils/pdfGenerator.ts`

PDF 생성 유틸리티 함수

## 개발 순서

1. 프로젝트 초기 설정 및 기본 구조
2. 데이터 모델 및 타입 정의
3. GPT API 통합 및 스토리 생성
4. 기본 UI 컴포넌트 (입력 폼, 에디터)
5. Nano Banana API 통합 및 이미지 생성
6. 리더 컴포넌트 구현
7. 저장/불러오기 기능
8. PDF 생성 및 소셜 공유
9. UI/UX 개선 및 최적화
10. 배포 준비