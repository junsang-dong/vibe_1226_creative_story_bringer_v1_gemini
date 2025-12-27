export function validateImageDimensions(width: number, height: number, expectedRatio: number = 1): boolean {
  const actualRatio = width / height;
  const tolerance = 0.01; // 1% 허용 오차
  return Math.abs(actualRatio - expectedRatio) < tolerance;
}

export function calculateOptimalDimensions(
  maxWidth: number,
  maxHeight: number,
  aspectRatio: number = 9 / 16
): { width: number; height: number } {
  // 9:16 비율 유지하면서 최대 크기 계산
  const widthByHeight = maxHeight * aspectRatio;
  const heightByWidth = maxWidth / aspectRatio;

  if (widthByHeight <= maxWidth) {
    return {
      width: Math.round(widthByHeight),
      height: maxHeight,
    };
  } else {
    return {
      width: maxWidth,
      height: Math.round(heightByWidth),
    };
  }
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export function getImageDimensions(img: HTMLImageElement): { width: number; height: number } {
  return {
    width: img.naturalWidth || img.width,
    height: img.naturalHeight || img.height,
  };
}

