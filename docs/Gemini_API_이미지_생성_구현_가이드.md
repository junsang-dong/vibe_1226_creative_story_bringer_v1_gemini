# Story Bringer: 스토리 및 이미지 생성 구현 가이드

## 개요

Story Bringer는 그래픽 노블을 생성하는 웹 애플리케이션으로, OpenAI GPT API를 사용하여 스토리 텍스트를 생성하고, Google Gemini API를 사용하여 이미지를 생성합니다. 이 문서는 스토리 텍스트와 이미지를 성공적으로 생성한 구현 방법을 정리합니다.

## 프로젝트 정보

- **프로젝트명**: Story Bringer
- **기술 스택**: React, Vite, TypeScript, Tailwind CSS
- **스토리 생성**: OpenAI GPT API (gpt-3.5-turbo)
- **이미지 생성**: Google Gemini API (gemini-3-pro-image-preview)
- **배포**: Vercel

## 환경 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정합니다:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_MODEL=gemini-3-pro-image-preview
```

### 2. API 키 발급

- **OpenAI API 키**: [OpenAI Platform](https://platform.openai.com/api-keys)에서 발급
- **Gemini API 키**: [Google AI Studio](https://makersuite.google.com/app/apikey)에서 발급

## 스토리 텍스트 생성 구현

### 1. OpenAI GPT API 서비스 (`src/services/gptService.ts`)

#### 사용 모델
- **모델명**: `gpt-3.5-turbo` (기본값)
- **엔드포인트**: `https://api.openai.com/v1/chat/completions`

#### 핵심 구현 포인트

**1) 프롬프트 구성**
- 다국어 지원 (한국어, 영어, 일본어)
- 사용자 입력 정보 통합 (장르, 스토리 라인, 등장 인물, 참고 작품, 아티스트, 디렉터, 추가 텍스트)
- 챕터 형식 명시: `[CHAPTER: 제목]` 형식으로 6-8개 챕터 생성 요청

**2) API 호출**
```typescript
const response = await axios.post(
  OPENAI_API_URL,
  {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: '당신은 전문 그래픽 노블 작가입니다...',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.8,
    max_tokens: 2000,
  },
  {
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    timeout: 60000,
  }
);
```

**3) 스토리 파싱**
- 생성된 스토리 텍스트를 `storyParser.ts`를 통해 챕터별로 분할
- 다양한 챕터 패턴 지원: `[CHAPTER: 제목]`, `CHAPTER: 제목`, `Chapter 1: 제목` 등
- 패턴이 없으면 문단 단위로 분할

**4) 에러 처리**
- API 키 확인
- HTTP 상태 코드별 에러 메시지 (401, 429, 500)
- 응답 데이터 검증

### 2. 스토리 생성 흐름

```
사용자 입력 수집
  ↓
OpenAI GPT API 호출
  ↓
스토리 텍스트 생성
  ↓
스토리 파서로 챕터별 분할
  ↓
Story 객체 생성
  ↓
스토리 편집 단계로 이동
```

## 이미지 생성 구현 상세

### 1. Gemini API 서비스 (`src/services/geminiService.ts`)

#### 사용 모델
- **모델명**: `gemini-3-pro-image-preview` (Nano Banana Pro)
- **엔드포인트**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent`

#### 핵심 구현 포인트

**1) API 엔드포인트 구성**
```typescript
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
```

**2) 프롬프트 구성**
```typescript
const fullPrompt = `Create a detailed graphic novel illustration. ${prompt}${style ? `, ${style} style` : ''}, ${aspectRatio} aspect ratio, square format, high quality, detailed illustration, graphic novel style, cinematic lighting, vibrant colors.`;
```

**3) 요청 본문 구조**
```typescript
const requestBody = {
  contents: [
    {
      parts: [
        { text: fullPrompt },
        // 참조 이미지가 있는 경우
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/png',
          },
        },
      ],
    },
  ],
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
    // 주의: responseMimeType은 이미지 생성에 사용할 수 없음
    // generateContent 엔드포인트는 텍스트 응답만 지원
  },
};
```

**4) 응답 처리**
- API는 `candidates[0].content.parts` 배열에 이미지 데이터를 반환
- `inlineData` 형식으로 base64 인코딩된 이미지 데이터 제공
- 응답에서 이미지 데이터 추출 후 `data:image/png;base64,{data}` 형식으로 변환

**실제 구현 코드:**
```typescript
const candidates = response.data.candidates;
if (!candidates || candidates.length === 0) {
  throw new Error('이미지 생성 응답에 후보가 없습니다.');
}

const content = candidates[0].content;
const imagePart = content.parts.find((part: any) => 
  part.inlineData || part.url || (part.text && (part.text.includes('http') || part.text.includes('data:')))
);

if (imagePart.inlineData) {
  const base64Data = imagePart.inlineData.data;
  const mimeType = imagePart.inlineData.mimeType || 'image/png';
  imageUrl = `data:${mimeType};base64,${base64Data}`;
}
```

#### 캐릭터 일관성 (Character Consistency)

첫 번째 생성된 이미지를 참조 이미지로 사용하여 캐릭터의 일관성을 유지합니다:

```typescript
if (referenceImageUrl) {
  let base64Image: string;
  let mimeType: string = 'image/png';

  if (referenceImageUrl.startsWith('data:')) {
    // data URL인 경우
    const parts = referenceImageUrl.split(',');
    base64Image = parts[1];
    mimeType = parts[0].split(';')[0].split(':')[1];
  } else {
    // URL인 경우 - axios로 이미지 다운로드 후 base64 변환
    const imageResponse = await axios.get(referenceImageUrl, { 
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
    });
    
    const bytes = new Uint8Array(imageResponse.data);
    const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    base64Image = btoa(binary);
    
    const contentType = imageResponse.headers['content-type'];
    if (contentType) {
      mimeType = contentType;
    }
  }
  
  // 요청 본문에 참조 이미지 추가
  requestBody.contents[0].parts.push({
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  });
  
  // 프롬프트에 캐릭터 일관성 지시 추가
  requestBody.contents[0].parts[0].text = `${fullPrompt}. Keep the character consistent with the reference image.`;
}
```

**참조 이미지 사용 흐름:**
1. 첫 번째 이미지 생성 시 (`textIndex === 0`): 참조 이미지 없이 생성
2. 두 번째 이후 이미지 생성 시: 첫 번째 이미지를 참조 이미지로 사용
3. 이미지 재생성 시: 다른 이미지를 참조 이미지로 사용 가능

### 2. 이미지 생성 가이드 기능

스토리 편집 단계에서 설정한 이미지 생성 가이드가 모든 이미지 생성에 자동으로 적용됩니다:

**구현 위치**: `src/components/ImageGenerator/ImageGenerator.tsx`

```typescript
// 스토리 텍스트 기반 프롬프트 생성
let prompt = `${storyText.text.substring(0, 300)}..., ${story.designStyle} style, 1:1 aspect ratio, graphic novel illustration`;

// 이미지 생성 가이드가 있으면 프롬프트에 포함
if (story.imageGenerationGuide && story.imageGenerationGuide.trim()) {
  prompt = `${prompt}. ${story.imageGenerationGuide.trim()}`;
}

// 최종 프롬프트는 geminiService에서 추가 가공됨
// "Create a detailed graphic novel illustration. [prompt], ..."
```

**데이터 모델**: `Story` 인터페이스에 `imageGenerationGuide?: string` 필드 추가
**저장 위치**: 스토리 편집 단계에서 사용자가 입력한 가이드가 스토리 객체에 저장됨

### 3. 이미지 생성 횟수 제한

익명 사용자의 토큰 남용을 방지하기 위해 하루 최대 12개로 제한:

**구현 위치**: `src/utils/imageGenerationLimit.ts`, `src/hooks/useImageGeneration.ts`

**주요 기능:**
- 로컬 스토리지 기반 일일 제한 관리 (`story_bringer_image_generation_limit` 키)
- 날짜 변경 시 자동 카운터 리셋 (YYYY-MM-DD 형식으로 날짜 비교)
- 제한 도달 시 명확한 에러 메시지 표시
- UI에 남은 생성 횟수 실시간 표시

**구현 코드:**
```typescript
// 제한 확인
if (!canGenerateImage()) {
  const remaining = getRemainingGenerationCount();
  const limit = getDailyLimit();
  throw new Error(`일일 이미지 생성 한도에 도달했습니다. (하루 최대 ${limit}개, 남은 횟수: ${remaining}개)`);
}

// 이미지 생성 성공 시 카운터 증가
incrementGenerationCount();
```

### 4. 이미지 생성 흐름

```
사용자가 스토리 텍스트 선택
  ↓
이미지 생성 횟수 제한 확인
  ↓
프롬프트 구성
  - 스토리 텍스트 (최대 300자)
  - 디자인 스타일
  - 이미지 생성 가이드 (선택사항)
  - 참조 이미지 (캐릭터 일관성용, 선택사항)
  ↓
Gemini API 호출
  ↓
응답에서 이미지 데이터 추출
  ↓
base64 → data URL 변환
  ↓
이미지 객체 생성 및 스토리에 추가
  ↓
생성 횟수 카운터 증가
```

## 주요 파일 구조

### 핵심 파일

1. **`src/services/geminiService.ts`**
   - Gemini API 호출 로직
   - 이미지 생성 및 응답 처리
   - 참조 이미지 처리

2. **`src/hooks/useImageGeneration.ts`**
   - 이미지 생성 훅
   - 생성 횟수 제한 확인
   - 에러 처리

3. **`src/components/ImageGenerator/ImageGenerator.tsx`**
   - 이미지 생성 UI
   - 개별 이미지 생성 및 재생성
   - 남은 생성 횟수 표시

4. **`src/utils/imageGenerationLimit.ts`**
   - 일일 생성 횟수 제한 관리
   - 로컬 스토리지 기반 카운터

5. **`src/utils/storyParser.ts`**
   - 스토리 텍스트를 챕터별로 파싱
   - 다양한 챕터 패턴 지원

## 성공적인 구현을 위한 핵심 사항

### 1. 프롬프트 구성

**성공 요인:**
- 명확한 이미지 생성 지시: "Create a detailed graphic novel illustration"
- 스타일 명시: 디자인 스타일, aspect ratio, 포맷 등
- 품질 지시: "high quality, detailed illustration, cinematic lighting, vibrant colors"

**예시 프롬프트:**
```
Create a detailed graphic novel illustration. [스토리 텍스트]..., anime style, 1:1 aspect ratio, square format, high quality, detailed illustration, graphic novel style, cinematic lighting, vibrant colors. 말 풍선 생성 금지.
```

### 2. API 응답 처리

**중요 포인트:**
- `responseMimeType`을 설정하지 않음 (이미지 생성에는 지원되지 않음)
- 응답의 `candidates[0].content.parts` 배열에서 이미지 데이터 찾기
- `inlineData` 형식의 base64 데이터를 data URL로 변환

**응답 구조:**
```typescript
{
  candidates: [
    {
      content: {
        parts: [
          {
            inlineData: {
              data: "base64_encoded_image_data",
              mimeType: "image/png"
            }
          }
        ]
      }
    }
  ]
}
```

### 3. 에러 처리

**구현된 에러 처리:**
- API 키 확인
- HTTP 상태 코드별 에러 메시지 (401, 403, 429, 400, 500, 503)
- 이미지 데이터 추출 실패 시 명확한 에러 메시지
- 생성 횟수 제한 도달 시 사용자 알림

### 4. 캐릭터 일관성 유지

**구현 방법:**
1. 첫 번째 생성된 이미지를 참조 이미지로 저장
2. 이후 이미지 생성 시 참조 이미지를 base64로 변환하여 요청에 포함
3. 프롬프트에 "Keep the character consistent with the reference image" 추가

## 이미지 생성 옵션

### 지원되는 옵션

- **Aspect Ratio**: 1:1 (기본값), 9:16, 16:9
- **디자인 스타일**: realistic, anime, manga, watercolor, digital-art, sketch, pixel-art, minimalist
- **참조 이미지**: 캐릭터 일관성 유지를 위한 참조 이미지 지원
- **이미지 생성 가이드**: 스토리 편집에서 설정한 공통 가이드 적용

## 제한 사항 및 주의사항

### 1. API 제한
- `generateContent` 엔드포인트는 `responseMimeType`에 이미지 MIME 타입을 지원하지 않음
- 텍스트 응답만 지원하므로, 이미지 생성 모델(`gemini-3-pro-image-preview`)이 자동으로 이미지를 반환

### 2. 일일 생성 제한
- 하루 최대 12개 이미지 생성 제한
- 로컬 스토리지 기반이므로 브라우저별로 독립적
- 날짜 변경 시 자동으로 카운터 리셋

### 3. 프롬프트 길이
- 스토리 텍스트는 최대 300자로 제한
- 이미지 생성 가이드 추가 시 전체 프롬프트 길이 고려 필요

## 트러블슈팅

### 문제 1: API가 텍스트를 반환함

**원인**: `responseMimeType`을 설정하려고 시도하거나, 프롬프트가 명확하지 않음

**해결책**:
- `responseMimeType` 설정 제거
- 프롬프트에 "Create a detailed graphic novel illustration" 명시
- 이미지 생성 모델(`gemini-3-pro-image-preview`) 사용 확인

### 문제 2: 404 에러 발생

**원인**: 잘못된 모델명 또는 API 버전

**해결책**:
- 모델명 확인: `gemini-3-pro-image-preview`
- API 버전 확인: `v1beta`
- API 키 유효성 확인

### 문제 3: 이미지 데이터 추출 실패

**원인**: 응답 구조가 예상과 다름

**해결책**:
- 응답 구조 로깅: `console.log('Content parts:', content.parts)`
- `inlineData`, `url`, `text` 등 다양한 형식 확인
- base64 데이터 검증

## 실제 구현 코드 예시

### 완전한 이미지 생성 흐름

```typescript
// 1. ImageGenerator에서 사용자 액션
const handleTextSelect = async (textIndex: number) => {
  // 제한 확인은 useImageGeneration 내부에서 수행
  
  // 프롬프트 구성
  let prompt = `${storyText.text.substring(0, 300)}..., ${story.designStyle} style, 1:1 aspect ratio, graphic novel illustration`;
  
  // 이미지 생성 가이드 추가
  if (story.imageGenerationGuide && story.imageGenerationGuide.trim()) {
    prompt = `${prompt}. ${story.imageGenerationGuide.trim()}`;
  }
  
  // 참조 이미지 가져오기
  const referenceImage = story.images.find(img => img.textIndex === 0);
  const referenceImageUrl = referenceImage?.url;
  
  // 이미지 생성
  const image = await generateSingleImage(
    prompt,
    textIndex,
    story.designStyle,
    referenceImageUrl
  );
};

// 2. useImageGeneration에서 제한 확인 및 API 호출
const generateSingleImage = async (prompt, textIndex, style, referenceImageUrl) => {
  // 제한 확인
  if (!canGenerateImage()) {
    throw new Error('일일 이미지 생성 한도에 도달했습니다.');
  }
  
  // Gemini API 호출
  const response = await generateImage({
    prompt,
    style,
    referenceImageUrl,
    aspectRatio: '1:1',
  });
  
  // 성공 시 카운터 증가
  incrementGenerationCount();
  
  return newImage;
};

// 3. geminiService에서 실제 API 호출
const generateImage = async (options) => {
  // 프롬프트 최종 구성
  const fullPrompt = `Create a detailed graphic novel illustration. ${prompt}...`;
  
  // 참조 이미지 처리
  if (referenceImageUrl) {
    // base64 변환 및 요청에 추가
  }
  
  // API 호출
  const response = await axios.post(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, requestBody);
  
  // 응답에서 이미지 데이터 추출
  const imagePart = response.data.candidates[0].content.parts.find(part => part.inlineData);
  const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  
  return { imageUrl, imageId };
};
```

## 성공 사례

### 구현된 기능

1. ✅ 개별 이미지 생성 (텍스트별)
2. ✅ 이미지 재생성
3. ✅ 캐릭터 일관성 유지 (참조 이미지)
4. ✅ 이미지 생성 가이드 적용
5. ✅ 일일 생성 횟수 제한 (하루 최대 12개)
6. ✅ 에러 처리 및 사용자 피드백
7. ✅ 남은 생성 횟수 표시
8. ✅ 다국어 지원 (한국어, 영어, 일본어)
9. ✅ 다크 모드 지원

### 최적화 포인트

1. **프롬프트 최적화**: 명확한 지시와 스타일 명시
2. **에러 처리**: 상세한 로깅과 사용자 친화적 메시지
3. **UI 피드백**: 생성 중 상태, 남은 횟수, 에러 표시
4. **성능**: 비동기 처리 및 상태 관리 최적화
5. **캐릭터 일관성**: 참조 이미지를 통한 일관된 캐릭터 생성

## 참고 자료

- [Google Gemini API 문서](https://ai.google.dev/docs)
- [Gemini 3 Pro Image Preview 모델 정보](https://ai.google.dev/models/gemini)
- 프로젝트 내 `xtra/Nano Banana Pro 기반 이미지 생성 방법.txt` 문서

## 코드 참조

### 주요 파일 경로

- **이미지 생성 서비스**: `src/services/geminiService.ts`
- **이미지 생성 훅**: `src/hooks/useImageGeneration.ts`
- **이미지 생성 UI**: `src/components/ImageGenerator/ImageGenerator.tsx`
- **생성 횟수 제한**: `src/utils/imageGenerationLimit.ts`
- **스토리 파싱**: `src/utils/storyParser.ts`
- **스토리 생성 서비스**: `src/services/gptService.ts` (OpenAI GPT API)

### 핵심 함수

1. **`generateImage(options: ImageGenerationOptions)`** - `src/services/geminiService.ts`
   - Gemini API를 호출하여 이미지 생성
   - 참조 이미지 처리
   - 응답에서 이미지 데이터 추출

2. **`generateSingleImage(prompt, textIndex, style, referenceImageUrl)`** - `src/hooks/useImageGeneration.ts`
   - 생성 횟수 제한 확인
   - 이미지 생성 호출
   - 생성 횟수 카운터 증가

3. **`canGenerateImage()`** - `src/utils/imageGenerationLimit.ts`
   - 일일 생성 횟수 제한 확인

4. **`parseStory(storyText: string)`** - `src/utils/storyParser.ts`
   - 스토리 텍스트를 챕터별로 파싱
   - 다양한 챕터 패턴 지원

## 업데이트 이력

- **2025-12-27**: 초기 문서 작성
  - Gemini API 이미지 생성 구현 방법 정리
  - 캐릭터 일관성 기능 설명
  - 이미지 생성 가이드 기능 추가
  - 일일 생성 횟수 제한 기능 추가
  - 실제 구현 코드 예시 추가
  - 상세한 코드 참조 정보 추가

---

**작성자**: Story Bringer 개발팀  
**최종 업데이트**: 2025-12-27  
**프로젝트 버전**: v1.0

