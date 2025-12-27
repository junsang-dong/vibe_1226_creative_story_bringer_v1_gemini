import axios from 'axios';
import type { Image } from '../types/story';

// Nano Banana Pro (gemini-3-pro-image-preview) 기반 이미지 생성
// 참고: xtra/Nano Banana Pro 기반 이미지 생성 방법.txt

// Vercel Functions를 통한 이미지 생성
// 프로덕션에서는 Vercel Functions를 사용하고, 개발 환경에서는 직접 API 호출 가능
const USE_VERCEL_FUNCTION = import.meta.env.PROD || import.meta.env.VITE_USE_VERCEL_FUNCTION === 'true';
const VERCEL_FUNCTION_URL = '/api/gemini/generateImage';

// 개발 환경에서 직접 API 호출하는 경우 (선택사항)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3-pro-image-preview';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export interface ImageGenerationOptions {
  prompt: string;
  style?: string;
  referenceImageUrl?: string; // 참조 이미지 URL (캐릭터 일관성용)
  aspectRatio?: '1:1' | '9:16' | '16:9';
}

export interface ImageGenerationResponse {
  imageUrl: string;
  imageId: string;
}

export async function generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResponse> {
  const { prompt, style, referenceImageUrl, aspectRatio = '1:1' } = options;

  // Vercel Functions를 사용하는 경우
  if (USE_VERCEL_FUNCTION) {
    console.log('Using Vercel Function for image generation');
    try {
      const response = await axios.post(
        VERCEL_FUNCTION_URL,
        {
          prompt,
          style,
          referenceImageUrl,
          aspectRatio,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 120000, // 120초 타임아웃
        }
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return {
        imageUrl: response.data.imageUrl,
        imageId: response.data.imageId,
      };
    } catch (error) {
      console.error('Vercel Function error:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  // 개발 환경에서 직접 API 호출하는 경우
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set. Check .env.local file.');
    throw new Error('Gemini API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.');
  }
  
  console.log('Gemini API configuration (direct call):', {
    hasKey: !!GEMINI_API_KEY,
    keyLength: GEMINI_API_KEY.length,
    model: GEMINI_MODEL,
    url: GEMINI_API_URL,
  });

  try {
    // Nano Banana Pro 기반 프롬프트 구성
    // gemini-3-pro-image-preview는 이미지 생성 모델이므로 프롬프트만으로 이미지 생성 가능
    // 프롬프트에 이미지 생성 지시를 명확히 포함
    const fullPrompt = `Create a detailed graphic novel illustration. ${prompt}${style ? `, ${style} style` : ''}, ${aspectRatio} aspect ratio, square format, high quality, detailed illustration, graphic novel style, cinematic lighting, vibrant colors.`;
    
    const requestBody: any = {
      contents: [
        {
          parts: [
            {
              text: fullPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
        // responseMimeType은 텍스트 응답에만 사용되므로 이미지 생성 시 제외
      },
    };

    // 참조 이미지가 있는 경우 추가 (캐릭터 일관성 유지)
    if (referenceImageUrl) {
      try {
        let base64Image: string;
        let mimeType: string = 'image/png';

        if (referenceImageUrl.startsWith('data:')) {
          // data URL인 경우
          const parts = referenceImageUrl.split(',');
          base64Image = parts[1];
          mimeType = parts[0].split(';')[0].split(':')[1];
        } else {
          // URL인 경우
          const imageResponse = await axios.get(referenceImageUrl, { 
            responseType: 'arraybuffer',
            responseEncoding: 'binary',
          });
          
          // ArrayBuffer를 base64로 변환
          const bytes = new Uint8Array(imageResponse.data);
          const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
          base64Image = btoa(binary);
          
          // MIME 타입 추정
          const contentType = imageResponse.headers['content-type'];
          if (contentType) {
            mimeType = contentType;
          }
        }
        
        requestBody.contents[0].parts.push({
          inlineData: {
            data: base64Image,
            mimeType: mimeType,
          },
        });
        
        // 프롬프트에 참조 지시 추가
        requestBody.contents[0].parts[0].text = `${fullPrompt}. Keep the character consistent with the reference image.`;
      } catch (refError) {
        console.warn('Failed to load reference image, continuing without it:', refError);
      }
    }

    console.log('Sending request to Gemini API (Nano Banana Pro):', { 
      model: GEMINI_MODEL, 
      prompt: fullPrompt.substring(0, 100),
      hasReference: !!referenceImageUrl,
      aspectRatio,
      url: GEMINI_API_URL,
    });
    
            const response = await axios.post(
              `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 120000, // 120초 타임아웃
        responseType: 'json',
      }
    );

    console.log('Gemini API response received:', {
      status: response.status,
      contentType: response.headers['content-type'],
      hasCandidates: !!response.data.candidates,
      candidatesLength: response.data.candidates?.length,
    });

    const candidates = response.data.candidates;
    if (!candidates || candidates.length === 0) {
      console.error('No candidates in response:', response.data);
      throw new Error('이미지 생성 응답에 후보가 없습니다.');
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      console.error('Invalid content structure:', content);
      throw new Error('응답 형식이 올바르지 않습니다.');
    }

    console.log('Content parts:', content.parts.map((p: any) => Object.keys(p)));

    // 이미지 데이터 추출
    const imagePart = content.parts.find((part: any) => 
      part.inlineData || part.url || (part.text && (part.text.includes('http') || part.text.includes('data:')))
    );
    
    if (!imagePart) {
      console.error('No image part found. Available parts:', content.parts);
      const textPart = content.parts.find((part: any) => part.text);
      if (textPart) {
        const text = textPart.text.trim();
        console.error('⚠️ Gemini API가 이미지 대신 텍스트를 반환했습니다:', text.substring(0, 300));
        throw new Error(`이미지가 생성되지 않았습니다. API가 텍스트를 반환했습니다: ${text.substring(0, 200)}`);
      }
      throw new Error('응답에서 이미지 데이터를 찾을 수 없습니다.');
    }

    console.log('Image part found:', { hasInlineData: !!imagePart.inlineData, hasUrl: !!imagePart.url, hasText: !!imagePart.text });

    let imageUrl: string;
    let imageId: string = Date.now().toString();

    if (imagePart.inlineData) {
      // base64 인코딩된 이미지인 경우
      const base64Data = imagePart.inlineData.data;
      const mimeType = imagePart.inlineData.mimeType || 'image/png';
      if (!base64Data) {
        throw new Error('base64 이미지 데이터가 비어있습니다.');
      }
      imageUrl = `data:${mimeType};base64,${base64Data}`;
      console.log('Using inlineData, length:', base64Data.length);
    } else if (imagePart.url) {
      // URL인 경우
      imageUrl = imagePart.url;
      imageId = imagePart.url.split('/').pop() || imageId;
      console.log('Using URL:', imageUrl);
    } else if (imagePart.text) {
      // 텍스트로 이미지 URL이 반환되는 경우
      const text = imagePart.text.trim();
      console.log('Text response:', text.substring(0, 200));
      
      if (text.startsWith('http://') || text.startsWith('https://')) {
        imageUrl = text;
      } else if (text.startsWith('data:')) {
        imageUrl = text;
      } else if (text.length > 100 && /^[A-Za-z0-9+/=]+$/.test(text)) {
        // base64 데이터만 있는 경우
        imageUrl = `data:image/png;base64,${text}`;
      } else {
        throw new Error(`이미지 생성에 실패했습니다. API 응답: ${text.substring(0, 200)}`);
      }
    } else {
      throw new Error('지원하지 않는 이미지 형식입니다.');
    }

    if (!imageUrl || imageUrl.length < 10) {
      throw new Error('유효하지 않은 이미지 URL입니다.');
    }

    console.log('Image URL generated successfully, length:', imageUrl.length);

    return {
      imageUrl,
      imageId,
    };
  } catch (error) {
    console.error('Gemini API error details:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = 
        error.response?.data?.error?.message || 
        error.response?.data?.message || 
        error.message;
      const statusCode = error.response?.status;
      const statusText = error.response?.statusText;
      
      console.error('Axios error details:', {
        status: statusCode,
        statusText,
        message: errorMessage,
        data: error.response?.data,
      });
      
      if (statusCode === 401) {
        throw new Error('Gemini API 키가 유효하지 않습니다. API 키를 확인해주세요.');
      } else if (statusCode === 403) {
        throw new Error('Gemini API 접근이 거부되었습니다. API 키 권한을 확인해주세요.');
      } else if (statusCode === 429) {
        throw new Error('API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else if (statusCode === 400) {
        throw new Error(`잘못된 요청입니다: ${errorMessage}`);
      } else if (statusCode === 500 || statusCode === 503) {
        throw new Error('Gemini 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      throw new Error(`Gemini API 오류 (${statusCode}): ${errorMessage}`);
    }
    throw error;
  }
}

export async function generateMultipleImages(
  prompts: string[],
  options?: Omit<ImageGenerationOptions, 'prompt'>
): Promise<ImageGenerationResponse[]> {
  const promises = prompts.map((prompt) => generateImage({ ...options, prompt }));
  return Promise.all(promises);
}

export function validateImageRatio(image: Image, expectedRatio: number = 1): boolean {
  const actualRatio = image.width / image.height;
  const tolerance = 0.01; // 1% 허용 오차
  return Math.abs(actualRatio - expectedRatio) < tolerance;
}
