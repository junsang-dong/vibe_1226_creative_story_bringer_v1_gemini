import { useState, useEffect, useRef, useMemo } from 'react';
import type { Story, Image } from '../../types/story';

interface PreviewProps {
  story: Story;
  onClose?: () => void;
}

export function Preview({ story, onClose }: PreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 표지 + 텍스트 기반 이미지들로 구성
  const coverImage = story.images.find((img) => img.isCover);
  const textBasedImages = story.images
    .filter((img) => !img.isCover && img.textIndex !== undefined && img.textIndex >= 0)
    .sort((a, b) => (a.textIndex || 0) - (b.textIndex || 0));

  // 표지 + 텍스트 이미지들
  const allImages: (Image & { textIndex?: number })[] = [];
  if (coverImage) {
    allImages.push(coverImage);
  }
  allImages.push(...textBasedImages);

  // 스토리 텍스트 목록 생성 (ImageGenerator와 동일한 로직)
  // 각 챕터를 하나의 텍스트 항목으로 사용
  const storyTexts = useMemo(() => {
    return story.chapters.map((chapter, index) => ({
      index,
      text: chapter.content,
      title: chapter.title,
      chapterId: chapter.id,
    }));
  }, [story.chapters]);

  // 각 이미지에 대응하는 텍스트와 챕터 정보 찾기
  const getTextForImage = (image: Image): { title: string; content: string; chapterNumber: number | null } => {
    if (image.isCover) {
      return {
        title: story.title,
        content: '',
        chapterNumber: null,
      };
    }
    if (image.textIndex !== undefined && image.textIndex >= 0) {
      const textItem = storyTexts[image.textIndex];
      if (textItem) {
        return {
          title: textItem.title,
          content: textItem.text,
          chapterNumber: textItem.index + 1, // 1부터 시작하는 챕터 번호
        };
      }
    }
    return { title: '', content: '', chapterNumber: null };
  };

  const totalPages = allImages.length;
  const progress = totalPages > 0 ? ((currentIndex + 1) / totalPages) * 100 : 0;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrev();
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
        if (onClose) onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, totalPages]);

  const handleNext = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTouchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleTouchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!handleTouchStart.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - handleTouchStart.current.x;
    const deltaY = touch.clientY - handleTouchStart.current.y;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }

    handleTouchStart.current = null;
  };

  const currentImage = allImages[currentIndex];
  const currentTextData = currentImage ? getTextForImage(currentImage) : { title: '', content: '', chapterNumber: null };

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 bg-black ${isFullscreen ? 'z-50' : 'relative'} overflow-hidden`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* 진행률 표시 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-10">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>


      {/* 컨트롤 버튼 */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="bg-black/50 text-white px-4 py-2 rounded hover:bg-black/70"
        >
          {isFullscreen ? '나가기' : '전체화면'}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="bg-black/50 text-white px-4 py-2 rounded hover:bg-black/70"
          >
            닫기
          </button>
        )}
      </div>

      {/* 페이지 내용 */}
      <DesktopView
        image={currentImage}
        title={currentTextData.title}
        content={currentTextData.content}
        chapterNumber={currentTextData.chapterNumber}
        isCover={currentImage?.isCover || false}
      />

      {/* 네비게이션 버튼 */}
      {!isFullscreen && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 items-center bg-black/50 rounded-lg px-4 py-2 z-20">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
          >
            이전
          </button>
          <span className="text-white text-sm">
            {currentIndex + 1} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === totalPages - 1}
            className="text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

interface DesktopViewProps {
  image?: Image;
  title: string;
  content: string;
  chapterNumber: number | null;
  isCover: boolean;
}

function DesktopView({ image, title, content, chapterNumber, isCover }: DesktopViewProps) {
  return (
    <div className="h-full w-full flex" style={{ aspectRatio: '16/9' }}>
      {/* 좌측: 이미지 */}
      <div className="flex-1 bg-gray-900 flex items-center justify-center overflow-hidden min-w-0">
        {image ? (
          <img
            src={image.url}
            alt={isCover ? '표지' : 'Story Image'}
            className="w-full h-full object-contain"
            style={{ aspectRatio: '16/9' }}
          />
        ) : (
          <div className="text-gray-500 text-center">
            <p>이미지 없음</p>
          </div>
        )}
      </div>
      {/* 우측: 텍스트 */}
      <div className="w-1/2 bg-gray-800 text-white p-6 sm:p-8 overflow-y-auto flex-shrink-0">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
          {isCover ? '표지' : chapterNumber !== null ? `스토리 #${chapterNumber}` : '스토리'}
        </h3>
        {title && (
          <h4 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 leading-tight">
            {title}
          </h4>
        )}
        {content && (
          <p className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        )}
        {!title && !content && (
          <p className="text-base sm:text-lg text-gray-400">텍스트 없음</p>
        )}
      </div>
    </div>
  );
}


