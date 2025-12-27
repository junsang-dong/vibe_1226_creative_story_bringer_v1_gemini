# GitHub 업로드 가이드

이 문서는 Story Bringer 프로젝트를 GitHub 리포지토리에 업로드하는 방법을 설명합니다.

## 사전 준비

1. GitHub 계정이 필요합니다.
2. 리포지토리가 생성되어 있어야 합니다: `https://github.com/junsang-dong/vibe_1226_creative_story_bringer_v1_gemini`

## 업로드 단계

### 1단계: Git 초기화

프로젝트 디렉토리에서 다음 명령어를 실행합니다:

```bash
# Git 초기화
git init

# 원격 리포지토리 추가
git remote add origin https://github.com/junsang-dong/vibe_1226_creative_story_bringer_v1_gemini.git
```

### 2단계: 파일 추가 및 커밋

```bash
# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: Story Bringer with Vercel Functions"
```

### 3단계: GitHub에 푸시

```bash
# 메인 브랜치로 푸시
git branch -M main
git push -u origin main
```

### 4단계: 업로드 확인

GitHub 리포지토리 페이지(`https://github.com/junsang-dong/vibe_1226_creative_story_bringer_v1_gemini`)에서 코드가 정상적으로 업로드되었는지 확인합니다.

## 주요 변경사항

### Vercel Functions 추가

- `api/gemini/generateImage.ts`: Gemini API 호출을 위한 Vercel Function
- `src/services/geminiService.ts`: 프로덕션 환경에서 Vercel Functions 호출하도록 수정

### 설정 파일 업데이트

- `vercel.json`: Vercel Functions 타임아웃 설정 추가
- `.gitignore`: 환경 변수 파일 제외 설정
- `package.json`: `@vercel/node` 의존성 추가

### 문서 추가

- `docs/Vercel_배포_가이드.md`: 상세한 배포 가이드
- `docs/Gemini_API_이미지_생성_구현_가이드.md`: 구현 가이드

## 다음 단계

GitHub 업로드가 완료되면 [Vercel 배포 가이드](docs/Vercel_배포_가이드.md)를 참고하여 Vercel에 배포하세요.

