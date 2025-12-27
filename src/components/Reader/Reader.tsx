import { useState, useEffect, useRef } from 'react';
import type { Story, Image, Chapter } from '../../types/story';

interface ReaderProps {
  story: Story;
  onClose?: () => void;
}

type PageData = 
  | { type: 'image'; image: Image }
  | { type: 'text'; chapter: Chapter; image?: Image };

export function Reader({ story, onClose }: ReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 표지 + 텍스트 기반 이미지들로 페이지 구성
  // 새로운 구조: textIndex 기반 이미지 사용
  const pages: PageData[] = [
    // 표지 이미지
    ...(story.images.filter((img) => img.isCover).map((img) => ({ type: 'image' as const, image: img }))),
    // 텍스트 기반 이미지들 (textIndex가 있는 이미지들)
    ...story.images
      .filter((img) => !img.isCover && img.textIndex !== undefined && img.textIndex >= 0)
      .sort((a, b) => (a.textIndex || 0) - (b.textIndex || 0))
      .map((img) => ({ type: 'image' as const, image: img })),
    // 기존 챕터 기반 이미지들 (하위 호환성)
    ...story.chapters.flatMap((chapter): PageData[] => {
      const chapterImage = story.images.find((img) => img.chapterIndex === chapter.order && !img.isCover && img.textIndex === undefined);
      if (chapterImage) {
        return [
          { type: 'text' as const, chapter, image: chapterImage },
          { type: 'image' as const, image: chapterImage },
        ];
      }
      return [{ type: 'text' as const, chapter }];
    }),
  ];

  const totalPages = pages.length;
  const progress = ((currentPage + 1) / totalPages) * 100;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [totalPages]);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
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

    // 수평 스와이프가 수직 스와이프보다 크면 페이지 전환
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }

    handleTouchStart.current = null;
  };

  const currentPageData = pages[currentPage];

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

      {/* 페이지 내용 */}
      <div className="h-full flex items-center justify-center">
        {currentPageData?.type === 'image' && (
          <img
            src={currentPageData.image.url}
            alt={currentPageData.image.isCover ? '표지' : `Page ${currentPage + 1}`}
            className="w-full h-full object-contain"
            style={{ 
              maxWidth: '100vw', 
              maxHeight: '100vh',
              objectFit: 'contain' 
            }}
          />
        )}

        {currentPageData?.type === 'text' && (
          <div className="w-full max-w-2xl px-6 py-12 text-white">
            <h2 className="text-3xl font-bold mb-6">{currentPageData.chapter.title}</h2>
            <div className="text-lg leading-relaxed whitespace-pre-wrap">
              {currentPageData.chapter.content}
            </div>
            {currentPageData.image && (
              <div className="mt-8">
                <img
                  src={currentPageData.image.url}
                  alt={currentPageData.chapter.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 네비게이션 버튼 */}
      {!isFullscreen && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 items-center bg-black/50 rounded-lg px-4 py-2">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
          >
            이전
          </button>
          <span className="text-white text-sm">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className="text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
          >
            다음
          </button>
        </div>
      )}

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
    </div>
  );
}

