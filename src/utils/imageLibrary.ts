// 이미지 라이브러리 유틸리티
// 로컬 스토리지 기반 이미지 저장 및 관리

export interface LibraryImage {
  id: string;
  url: string; // base64 data URL 또는 URL
  prompt?: string;
  createdAt: string;
  name?: string;
}

const LIBRARY_STORAGE_KEY = 'story_bringer_image_library';

// 이미지 라이브러리에서 모든 이미지 가져오기
export function getLibraryImages(): LibraryImage[] {
  try {
    const stored = localStorage.getItem(LIBRARY_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as LibraryImage[];
  } catch (error) {
    console.error('Failed to load image library:', error);
    return [];
  }
}

// 이미지 라이브러리에 이미지 추가
export function addImageToLibrary(image: Omit<LibraryImage, 'id' | 'createdAt'>): LibraryImage {
  const images = getLibraryImages();
  const newImage: LibraryImage = {
    ...image,
    id: `lib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  
  images.unshift(newImage); // 최신 이미지가 앞에 오도록
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(images));
  
  return newImage;
}

// 이미지 라이브러리에서 이미지 삭제
export function removeImageFromLibrary(imageId: string): void {
  const images = getLibraryImages();
  const filtered = images.filter(img => img.id !== imageId);
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(filtered));
}

// 이미지 라이브러리에서 이미지 가져오기
export function getImageFromLibrary(imageId: string): LibraryImage | null {
  const images = getLibraryImages();
  return images.find(img => img.id === imageId) || null;
}

// 이미지 다운로드
export function downloadImage(imageUrl: string, filename: string = 'image.png'): void {
  try {
    // data URL인 경우
    if (imageUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    // URL인 경우
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to download image:', error);
  }
}

// 파일을 base64로 변환
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// 이미지 업로드 및 라이브러리에 추가
export async function uploadImageToLibrary(file: File): Promise<LibraryImage> {
  const dataUrl = await fileToDataURL(file);
  return addImageToLibrary({
    url: dataUrl,
    name: file.name,
  });
}

