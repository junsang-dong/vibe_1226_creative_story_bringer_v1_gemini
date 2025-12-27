# Story Bringer: Vercel 배포 가이드

## 개요

이 가이드는 Story Bringer 웹 애플리케이션을 GitHub 리포지토리에 업로드하고 Vercel을 통해 배포하는 방법을 설명합니다. Vercel Functions를 사용하여 Gemini API 키를 안전하게 관리합니다.

## 사전 준비

1. **GitHub 계정**: [GitHub](https://github.com) 계정이 필요합니다.
2. **Vercel 계정**: [Vercel](https://vercel.com) 계정이 필요합니다.
3. **API 키**:
   - OpenAI API 키 (스토리 생성용)
   - Gemini API 키 (이미지 생성용)

## 1단계: GitHub 리포지토리 생성 및 코드 업로드

### 1.1 GitHub 리포지토리 생성

1. [GitHub](https://github.com)에 로그인합니다.
2. 우측 상단의 "+" 버튼을 클릭하고 "New repository"를 선택합니다.
3. 리포지토리 정보 입력:
   - **Repository name**: `vibe_1226_creative_story_bringer_v1_gemini`
   - **Description**: "Story Bringer - Graphic Novel Generator"
   - **Visibility**: Public 또는 Private 선택
   - **Initialize this repository with**: 체크하지 않음 (기존 코드 업로드)
4. "Create repository" 버튼을 클릭합니다.

### 1.2 로컬 프로젝트를 Git 리포지토리로 초기화

터미널에서 프로젝트 디렉토리로 이동하여 다음 명령어를 실행합니다:

```bash
# Git 초기화
git init

# 원격 리포지토리 추가 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/junsang-dong/vibe_1226_creative_story_bringer_v1_gemini.git

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Story Bringer web app"

# 메인 브랜치로 푸시
git branch -M main
git push -u origin main
```

### 1.3 GitHub에 코드 업로드 확인

GitHub 리포지토리 페이지에서 코드가 정상적으로 업로드되었는지 확인합니다.

## 2단계: Vercel 프로젝트 생성 및 배포

### 2.1 Vercel에 프로젝트 연결

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인합니다.
2. "Add New..." → "Project"를 클릭합니다.
3. "Import Git Repository"에서 방금 생성한 GitHub 리포지토리를 선택합니다.
4. "Import" 버튼을 클릭합니다.

### 2.2 프로젝트 설정

Vercel이 자동으로 프로젝트를 감지합니다:

- **Framework Preset**: Vite (자동 감지)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `dist` (기본값)
- **Install Command**: `npm install` (기본값)

### 2.3 환경 변수 설정

**중요**: Vercel Functions에서 사용할 환경 변수를 설정해야 합니다.

1. 프로젝트 설정 화면에서 "Environment Variables" 섹션을 찾습니다.
2. 다음 환경 변수를 추가합니다:

#### 필수 환경 변수

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `GEMINI_API_KEY` | `your_gemini_api_key` | Gemini API 키 (이미지 생성용) |
| `GEMINI_MODEL` | `gemini-3-pro-image-preview` | 사용할 Gemini 모델 (선택사항) |
| `VITE_OPENAI_API_KEY` | `your_openai_api_key` | OpenAI API 키 (스토리 생성용) |

**주의사항**:
- `GEMINI_API_KEY`는 Vercel Functions에서만 사용되므로 `VITE_` 접두사가 없습니다.
- `VITE_OPENAI_API_KEY`는 클라이언트에서 직접 사용되므로 `VITE_` 접두사가 필요합니다.

3. 각 환경 변수에 대해 배포 환경을 선택합니다:
   - **Production**: 프로덕션 환경
   - **Preview**: 프리뷰 환경
   - **Development**: 개발 환경

4. "Save" 버튼을 클릭합니다.

### 2.4 배포 실행

1. "Deploy" 버튼을 클릭합니다.
2. Vercel이 자동으로 빌드 및 배포를 시작합니다.
3. 배포가 완료되면 배포 URL이 제공됩니다.

## 3단계: Vercel Functions 구조

### 3.1 파일 구조

```
프로젝트 루트/
├── api/
│   └── gemini/
│       └── generateImage.ts    # Gemini API 호출 함수
├── src/
│   └── services/
│       └── geminiService.ts    # 클라이언트 서비스 (Vercel Functions 호출)
└── vercel.json                 # Vercel 설정 파일
```

### 3.2 Vercel Functions 동작 방식

1. **클라이언트 요청**: `src/services/geminiService.ts`에서 `/api/gemini/generateImage`로 POST 요청
2. **Vercel Function 실행**: `api/gemini/generateImage.ts`가 서버에서 실행
3. **API 키 사용**: Vercel Function 내부에서 `process.env.GEMINI_API_KEY` 사용
4. **Gemini API 호출**: 서버에서 Gemini API를 직접 호출
5. **응답 반환**: 생성된 이미지 데이터를 클라이언트에 반환

### 3.3 보안 이점

- **API 키 보호**: Gemini API 키가 클라이언트에 노출되지 않음
- **서버 사이드 실행**: API 호출이 서버에서 실행되어 CORS 문제 해결
- **환경 변수 관리**: Vercel Dashboard에서 환경 변수를 안전하게 관리

## 4단계: 배포 확인 및 테스트

### 4.1 배포 상태 확인

1. Vercel Dashboard에서 배포 상태를 확인합니다.
2. 배포가 성공하면 "Ready" 상태가 표시됩니다.
3. 배포 URL을 클릭하여 웹 애플리케이션에 접속합니다.

### 4.2 기능 테스트

1. **스토리 생성**: 스토리 요소를 입력하고 스토리 생성 기능을 테스트합니다.
2. **이미지 생성**: 이미지 생성 기능이 정상적으로 작동하는지 확인합니다.
3. **에러 확인**: 브라우저 개발자 도구의 콘솔에서 에러가 없는지 확인합니다.

### 4.3 Vercel Functions 로그 확인

1. Vercel Dashboard에서 프로젝트를 선택합니다.
2. "Functions" 탭을 클릭합니다.
3. `/api/gemini/generateImage` 함수의 로그를 확인합니다.
4. 에러가 발생하면 로그에서 원인을 확인할 수 있습니다.

## 5단계: 커스텀 도메인 설정 (선택사항)

### 5.1 도메인 추가

1. Vercel Dashboard에서 프로젝트를 선택합니다.
2. "Settings" → "Domains"로 이동합니다.
3. 도메인을 입력하고 "Add" 버튼을 클릭합니다.
4. DNS 설정 안내를 따라 도메인을 연결합니다.

## 트러블슈팅

### 문제 1: 배포 실패

**증상**: Vercel 배포가 실패합니다.

**해결책**:
- 빌드 로그를 확인하여 에러 원인을 파악합니다.
- `package.json`의 빌드 스크립트가 올바른지 확인합니다.
- 환경 변수가 올바르게 설정되었는지 확인합니다.

### 문제 2: 이미지 생성 실패

**증상**: 이미지 생성 시 에러가 발생합니다.

**해결책**:
- Vercel Functions 로그를 확인합니다.
- `GEMINI_API_KEY` 환경 변수가 올바르게 설정되었는지 확인합니다.
- API 키가 유효한지 확인합니다.

### 문제 3: CORS 에러

**증상**: 브라우저에서 CORS 에러가 발생합니다.

**해결책**:
- Vercel Functions에 CORS 헤더가 올바르게 설정되어 있는지 확인합니다.
- `api/gemini/generateImage.ts`의 CORS 설정을 확인합니다.

### 문제 4: 환경 변수 미적용

**증상**: 환경 변수가 적용되지 않습니다.

**해결책**:
- Vercel Dashboard에서 환경 변수를 다시 설정합니다.
- 배포를 다시 실행합니다 (환경 변수 변경 후 재배포 필요).
- 환경 변수 이름이 정확한지 확인합니다.

## 주요 파일 설명

### `api/gemini/generateImage.ts`

Vercel Functions로 구현된 Gemini API 호출 함수입니다.

**주요 기능**:
- Gemini API 키를 서버에서 안전하게 사용
- 이미지 생성 요청 처리
- 참조 이미지 지원 (캐릭터 일관성)
- 에러 처리 및 로깅

### `src/services/geminiService.ts`

클라이언트에서 사용하는 이미지 생성 서비스입니다.

**주요 기능**:
- 프로덕션 환경에서는 Vercel Functions 호출
- 개발 환경에서는 직접 API 호출 가능 (선택사항)
- 동일한 인터페이스 제공

### `vercel.json`

Vercel 배포 설정 파일입니다.

**주요 설정**:
- 빌드 명령어
- 출력 디렉토리
- 라우팅 규칙

## 환경 변수 요약

### Vercel Functions용 (서버 사이드)

- `GEMINI_API_KEY`: Gemini API 키
- `GEMINI_MODEL`: 사용할 Gemini 모델 (선택사항)

### 클라이언트용 (브라우저)

- `VITE_OPENAI_API_KEY`: OpenAI API 키 (스토리 생성용)

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Vercel Functions 가이드](https://vercel.com/docs/functions)
- [GitHub Actions와 Vercel 연동](https://vercel.com/docs/integrations)

## 업데이트 이력

- **2025-12-27**: 초기 문서 작성
  - GitHub 리포지토리 업로드 방법
  - Vercel 배포 설정
  - Vercel Functions를 통한 Gemini API 호출 구현
  - 환경 변수 설정 가이드

---

**작성자**: Story Bringer 개발팀  
**최종 업데이트**: 2025-12-27

