import { useState, useCallback, useMemo } from 'react';
import type { Story, Image } from '../../types/story';
import { useImageGeneration } from '../../hooks/useImageGeneration';
import { getRemainingGenerationCount, getDailyLimit } from '../../utils/imageGenerationLimit';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/i18n';

interface ImageGeneratorProps {
  story: Story;
  onImagesGenerated: (images: Image[]) => void;
  onImageUpdate: (imageId: string, newImage: Image) => void;
  onCoverSelected: (imageId: string) => void;
}

export function ImageGenerator({
  story,
  onImagesGenerated,
  onImageUpdate,
  onCoverSelected,
}: ImageGeneratorProps) {
  const { language } = useApp();
  const { generateSingleImage, regenerateImage, isGenerating, error } = useImageGeneration();
  const [generatingTextIndex, setGeneratingTextIndex] = useState<number | null>(null);
  const [selectedTextIndex, setSelectedTextIndex] = useState<number | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [remainingCount, setRemainingCount] = useState(getRemainingGenerationCount());
  const [dailyLimit] = useState(getDailyLimit());

  // 남은 횟수 업데이트
  const updateRemainingCount = useCallback(() => {
    setRemainingCount(getRemainingGenerationCount());
  }, []);
  
  // 현재 사용 중인 모델 정보
  const currentModel = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3-pro-image-preview';
  const modelDisplayName = currentModel === 'gemini-3-pro-image-preview'
    ? 'Nano Banana Pro (gemini-3-pro-image-preview)'
    : currentModel === 'gemini-2.5-flash-image'
    ? 'Nano Banana (gemini-2.5-flash-image)'
    : currentModel;

  // 스토리 텍스트 목록 생성 (챕터 개수만큼)
  // 각 챕터를 하나의 텍스트 항목으로 사용
  const storyTexts = useMemo(() => {
    return story.chapters.map((chapter, index) => ({
      index,
      text: chapter.content,
      title: chapter.title,
      chapterId: chapter.id,
    }));
  }, [story.chapters]);

  // 텍스트 선택 시 이미지 생성
  const handleTextSelect = useCallback(async (textIndex: number) => {
    if (isGenerating) {
      console.warn('이미지 생성이 이미 진행 중입니다.');
      return;
    }
    
    setSelectedTextIndex(textIndex);
    setGeneratingTextIndex(textIndex);
    setLocalError(null);
    
    const storyText = storyTexts[textIndex];
    if (!storyText) {
      console.error('Story text not found for index:', textIndex);
      setLocalError('스토리 텍스트를 찾을 수 없습니다.');
      setGeneratingTextIndex(null);
      return;
    }

    console.log('Starting image generation for text index:', textIndex, 'text:', storyText.text.substring(0, 100));

    try {
      // 첫 번째 이미지를 참조 이미지로 사용 (캐릭터 일관성)
      const referenceImage = story.images.find(img => img.textIndex === 0);
      const referenceImageUrl = referenceImage?.url;
      console.log('Reference image:', referenceImageUrl ? 'found' : 'not found');

      let prompt = `${storyText.text.substring(0, 300)}..., ${story.designStyle} style, 1:1 aspect ratio, graphic novel illustration`;
      
      // 이미지 생성 가이드가 있으면 프롬프트에 포함
      if (story.imageGenerationGuide && story.imageGenerationGuide.trim()) {
        prompt = `${prompt}. ${story.imageGenerationGuide.trim()}`;
      }
      
      console.log('Generating image with prompt:', prompt.substring(0, 100));

      const image = await generateSingleImage(
        prompt,
        textIndex,
        story.designStyle,
        referenceImageUrl
      );

      console.log('Image generated successfully:', image.id, 'url length:', image.url.length);

      // 남은 횟수 업데이트
      updateRemainingCount();

      // 기존 이미지가 있으면 업데이트, 없으면 추가
      const existingImageIndex = story.images.findIndex(img => img.textIndex === textIndex);
      if (existingImageIndex >= 0) {
        const existingImage = story.images[existingImageIndex];
        console.log('Updating existing image:', existingImage.id);
        onImageUpdate(existingImage.id, { ...image, textIndex });
      } else {
        // 새 이미지 추가 (기존 이미지 유지)
        console.log('Adding new image to story');
        const updatedImages = [...story.images];
        updatedImages.push({ ...image, textIndex });
        onImagesGenerated(updatedImages);
      }
    } catch (err) {
      console.error('Failed to generate image:', err);
      const errorMessage = err instanceof Error ? err.message : '이미지 생성에 실패했습니다.';
      setLocalError(errorMessage);
      // 남은 횟수 업데이트 (에러 발생 시에도)
      updateRemainingCount();
      // 사용자에게 에러 표시
      alert(`이미지 생성 오류: ${errorMessage}\n\n자세한 내용은 브라우저 콘솔을 확인해주세요.`);
    } finally {
      setGeneratingTextIndex(null);
    }
  }, [story, storyTexts, generateSingleImage, isGenerating, onImagesGenerated, onImageUpdate, updateRemainingCount]);

  // 이미지 재생성
  const handleRegenerateImage = useCallback(
    async (imageId: string, textIndex: number) => {
      if (isGenerating) return;
      
      setGeneratingTextIndex(textIndex);
      const storyText = storyTexts[textIndex];
      
      if (!storyText) return;

      try {
        const referenceImage = story.images.find(img => img.textIndex === 0 && img.id !== imageId);
        const referenceImageUrl = referenceImage?.url;

        let regeneratePrompt = `${storyText.text.substring(0, 300)}..., ${story.designStyle} style, 1:1 aspect ratio, graphic novel illustration`;
        
        // 이미지 생성 가이드가 있으면 프롬프트에 포함
        if (story.imageGenerationGuide && story.imageGenerationGuide.trim()) {
          regeneratePrompt = `${regeneratePrompt}. ${story.imageGenerationGuide.trim()}`;
        }
        
        const newImage = await regenerateImage(
          imageId,
          regeneratePrompt,
          story.designStyle,
          referenceImageUrl
        );
        
        onImageUpdate(imageId, { ...newImage, textIndex });
        
        // 남은 횟수 업데이트
        updateRemainingCount();
      } catch (err) {
        console.error('Failed to regenerate image:', err);
      } finally {
        setGeneratingTextIndex(null);
      }
    },
    [story, storyTexts, regenerateImage, isGenerating, onImageUpdate, updateRemainingCount]
  );

  // 표지 이미지 선택
  const handleCoverSelect = useCallback((imageId: string) => {
    onCoverSelected(imageId);
  }, [onCoverSelected]);


  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{t('imageGenerator.title', language)}</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-600">{t('imageGenerator.remainingCount', language)}</span>
            <span className={`px-3 py-1 rounded-full font-semibold ${
              remainingCount > 0
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {remainingCount} / {dailyLimit}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">{t('imageGenerator.model', language)}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
              {modelDisplayName}
            </span>
          </div>
        </div>
      </div>

      {(error || localError) && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <p className="font-semibold">이미지 생성 오류:</p>
          <p>{error || localError}</p>
          <p className="text-sm mt-2 text-red-600">브라우저 콘솔에서 자세한 오류 정보를 확인할 수 있습니다.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* 좌측: 이미지 목록 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('imageGenerator.imageList', language)}</h3>
          <div className="grid grid-cols-2 gap-4">
            {storyTexts.map((_, index) => {
              const image = story.images.find(img => img.textIndex === index);
              const isGenerating = generatingTextIndex === index;
              
              return (
                <ImageCard
                  key={image?.id || `placeholder-${index}`}
                  image={image}
                  index={index}
                  isGenerating={isGenerating}
                  isCover={image?.isCover || false}
                  language={language}
                  onRegenerate={image ? () => handleRegenerateImage(image.id, index) : undefined}
                  onSelectCover={image ? () => handleCoverSelect(image.id) : undefined}
                />
              );
            })}
          </div>
        </div>

        {/* 우측: 텍스트 목록 */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t('imageGenerator.textList', language)} ({storyTexts.length})</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {storyTexts.map((storyText, index) => {
              const image = story.images.find(img => img.textIndex === index);
              const isSelected = selectedTextIndex === index;
              const isGenerating = generatingTextIndex === index;
              
              return (
                <TextItem
                  key={index}
                  index={index}
                  title={storyText.title}
                  text={storyText.text}
                  hasImage={!!image}
                  isSelected={isSelected}
                  isGenerating={isGenerating}
                  language={language}
                  onClick={() => handleTextSelect(index)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ImageCardProps {
  image?: Image;
  index: number;
  isGenerating: boolean;
  isCover: boolean;
  language: 'ko' | 'en' | 'ja';
  onRegenerate?: () => void;
  onSelectCover?: () => void;
}

function ImageCard({ image, index, isGenerating, isCover, language, onRegenerate, onSelectCover }: ImageCardProps) {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden relative">
      <div className="aspect-square bg-gray-100 relative">
        {isGenerating ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">{t('imageGenerator.generating', language)}</p>
            </div>
          </div>
        ) : image ? (
          <>
            <img
              src={image.url}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image load error:', image.id);
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {isCover && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded font-semibold">
                {t('preview.cover', language)}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400">
            <div className="text-center">
              <p className="text-sm">{t('imageGenerator.noImage', language)}</p>
              <p className="text-xs mt-1">{t('imageGenerator.selectText', language)}</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-2 space-y-1">
        <p className="text-xs font-semibold text-center">#{index + 1}</p>
        {image && (
          <div className="flex gap-1">
            {!isCover && onSelectCover && (
              <button
                onClick={onSelectCover}
                className="flex-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded hover:bg-yellow-600"
              >
                {t('imageGenerator.selectCover', language)}
              </button>
            )}
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="flex-1 bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700"
              >
                {t('imageGenerator.regenerate', language)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface TextItemProps {
  index: number;
  title: string;
  text: string;
  hasImage: boolean;
  isSelected: boolean;
  isGenerating: boolean;
  language: 'ko' | 'en' | 'ja';
  onClick: () => void;
}

function TextItem({ index: _index, title, text, hasImage, isSelected, isGenerating, language, onClick }: TextItemProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-600 bg-blue-50'
          : hasImage
          ? 'border-green-300 bg-green-50'
          : 'border-gray-300 bg-white hover:border-gray-400'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-sm">{title}</h4>
        <div className="flex items-center gap-2">
          {hasImage && (
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">{t('imageGenerator.imageGenerated', language)}</span>
          )}
          {isGenerating && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
          )}
        </div>
      </div>
      <p className="text-sm text-gray-700 line-clamp-3">{text}</p>
      <p className="text-xs text-gray-500 mt-2">{t('imageGenerator.selectText', language)}</p>
    </div>
  );
}
