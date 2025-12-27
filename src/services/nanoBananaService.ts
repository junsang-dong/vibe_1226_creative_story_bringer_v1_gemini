import axios from 'axios';
import type { Image } from '../types/story';

const NANO_BANANA_API_URL = import.meta.env.VITE_NANO_BANANA_API_URL || 'https://api.nanobanana.com';
const NANO_BANANA_API_KEY = import.meta.env.VITE_NANO_BANANA_API_KEY;

export interface ImageGenerationOptions {
  prompt: string;
  width?: number;
  height?: number;
  style?: string;
}

export interface ImageGenerationResponse {
  imageUrl: string;
  imageId: string;
}

export async function generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResponse> {
  if (!NANO_BANANA_API_KEY) {
    throw new Error('Nano Banana API key is not configured');
  }

  const { prompt, width = 720, style } = options;
  // height는 사용하지 않음 (9:16 비율로 자동 계산)

  // 9:16 비율 강제
  const aspectRatio = 9 / 16;
  const finalWidth = width;
  const finalHeight = Math.round(width / aspectRatio);

  try {
    // Nano Banana API는 일반적인 이미지 생성 API 패턴을 따릅니다
    // 실제 API 엔드포인트와 요청 형식은 API 문서에 따라 조정이 필요합니다
    const response = await axios.post(
      `${NANO_BANANA_API_URL}/v1/images/generations`,
      {
        prompt,
        width: finalWidth,
        height: finalHeight,
        style,
        aspect_ratio: '9:16',
        model: 'default',
      },
      {
        headers: {
          'Authorization': `Bearer ${NANO_BANANA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // API 응답 형식에 따라 조정 필요
    const imageUrl = response.data.data?.[0]?.url || response.data.image_url || response.data.url;
    const imageId = response.data.data?.[0]?.id || response.data.image_id || Date.now().toString();

    if (!imageUrl) {
      throw new Error('Failed to generate image: No image URL in response');
    }

    return {
      imageUrl,
      imageId,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.response?.data?.message || error.message;
      throw new Error(`Nano Banana API error: ${errorMessage}`);
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

export function validateImageRatio(image: Image, expectedRatio: number = 9 / 16): boolean {
  const actualRatio = image.width / image.height;
  const tolerance = 0.01; // 1% 허용 오차
  return Math.abs(actualRatio - expectedRatio) < tolerance;
}

