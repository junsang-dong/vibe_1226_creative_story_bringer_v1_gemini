import { useState, useCallback } from 'react';
import type { Image } from '../types/story';
import { generateImage } from '../services/geminiService';
import { generateId } from '../utils/storyParser';
import {
  canGenerateImage,
  incrementGenerationCount,
  getRemainingGenerationCount,
  getDailyLimit,
} from '../utils/imageGenerationLimit';

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSingleImage = useCallback(async (
    prompt: string,
    textIndex: number,
    style?: string,
    referenceImageUrl?: string
  ): Promise<Image> => {
    // 이미지 생성 횟수 제한 확인
    if (!canGenerateImage()) {
      const remaining = getRemainingGenerationCount();
      const limit = getDailyLimit();
      const errorMessage = `일일 이미지 생성 한도에 도달했습니다. (하루 최대 ${limit}개, 남은 횟수: ${remaining}개)`;
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateImage({
        prompt,
        style,
        referenceImageUrl,
        aspectRatio: '1:1', // 1:1 비율
      });

      // 이미지 생성 성공 시 카운터 증가
      incrementGenerationCount();

      const newImage: Image = {
        id: generateId(),
        url: response.imageUrl,
        prompt,
        chapterIndex: -1, // 텍스트 기반이므로 챕터 인덱스는 -1
        isCover: false,
        width: 1024, // 1:1 비율
        height: 1024,
        createdAt: new Date().toISOString(),
        textIndex,
      };

      return newImage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate image';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const regenerateImage = useCallback(async (
    _imageId: string,
    prompt: string,
    style?: string,
    referenceImageUrl?: string
  ): Promise<Image> => {
    // 이미지 생성 횟수 제한 확인
    if (!canGenerateImage()) {
      const remaining = getRemainingGenerationCount();
      const limit = getDailyLimit();
      const errorMessage = `일일 이미지 생성 한도에 도달했습니다. (하루 최대 ${limit}개, 남은 횟수: ${remaining}개)`;
      setError(errorMessage);
      throw new Error(errorMessage);
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateImage({
        prompt,
        style,
        referenceImageUrl,
        aspectRatio: '1:1',
      });

      // 이미지 생성 성공 시 카운터 증가
      incrementGenerationCount();

      const newImage: Image = {
        id: generateId(),
        url: response.imageUrl,
        prompt,
        chapterIndex: -1,
        isCover: false,
        width: 1024,
        height: 1024,
        createdAt: new Date().toISOString(),
      };

      return newImage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to regenerate image';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    isGenerating,
    error,
    generateSingleImage,
    regenerateImage,
  };
}
