import { useState, useCallback, useEffect, useRef } from 'react';
import type { LibraryImage } from '../../utils/imageLibrary';
import {
  getLibraryImages,
  removeImageFromLibrary,
  downloadImage,
  uploadImageToLibrary,
} from '../../utils/imageLibrary';

interface ImageLibraryProps {
  onSelectImage?: (image: LibraryImage) => void;
  showUpload?: boolean;
  showDownload?: boolean;
  showDelete?: boolean;
}

export function ImageLibrary({
  onSelectImage,
  showUpload = true,
  showDownload = true,
  showDelete = true,
}: ImageLibraryProps) {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 라이브러리 로드
  const loadImages = useCallback(() => {
    const libraryImages = getLibraryImages();
    setImages(libraryImages);
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // 이미지 업로드
  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          await uploadImageToLibrary(file);
        }
      }
      loadImages();
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [loadImages]);

  // 이미지 삭제
  const handleDelete = useCallback((imageId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (confirm('이미지를 라이브러리에서 삭제하시겠습니까?')) {
      removeImageFromLibrary(imageId);
      loadImages();
    }
  }, [loadImages]);

  // 이미지 다운로드
  const handleDownload = useCallback((image: LibraryImage, event: React.MouseEvent) => {
    event.stopPropagation();
    const filename = image.name || `image_${image.id}.png`;
    downloadImage(image.url, filename);
  }, []);

  // 이미지 선택
  const handleSelect = useCallback((image: LibraryImage) => {
    if (onSelectImage) {
      onSelectImage(image);
    }
  }, [onSelectImage]);

  return (
    <div className="mt-8 border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">이미지 라이브러리</h3>
        {showUpload && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? '업로드 중...' : '이미지 업로드'}
            </label>
          </div>
        )}
      </div>

      {images.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>저장된 이미지가 없습니다.</p>
          {showUpload && <p className="text-sm mt-2">이미지를 업로드하거나 생성하여 라이브러리에 저장하세요.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden ${
                onSelectImage ? 'hover:border-blue-500' : ''
              }`}
              onClick={() => handleSelect(image)}
            >
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={image.url}
                  alt={image.name || 'Library image'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2">
                  {showDownload && (
                    <button
                      onClick={(e) => handleDownload(image, e)}
                      className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700 transition-opacity"
                      title="다운로드"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  )}
                  {showDelete && (
                    <button
                      onClick={(e) => handleDelete(image.id, e)}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-1.5 rounded hover:bg-red-700 transition-opacity"
                      title="삭제"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              {image.name && (
                <p className="text-xs text-gray-600 truncate px-1 py-0.5" title={image.name}>
                  {image.name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

