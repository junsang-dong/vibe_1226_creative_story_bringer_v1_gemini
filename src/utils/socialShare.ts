export async function shareStory(
  title: string,
  text: string,
  url?: string
): Promise<boolean> {
  const shareData: ShareData = {
    title,
    text,
    ...(url && { url }),
  };

  // Web Share API 지원 확인
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      // 사용자가 공유를 취소한 경우
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  }

  // Web Share API를 지원하지 않는 경우 폴백
  return fallbackShare(title, text, url);
}

function fallbackShare(title: string, text: string, url?: string): boolean {
  const shareText = `${title}\n\n${text}${url ? `\n\n${url}` : ''}`;

  // 클립보드에 복사
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        alert('클립보드에 복사되었습니다!');
      })
      .catch((error) => {
        console.error('Failed to copy to clipboard:', error);
        // 최후의 수단: 텍스트 영역 생성
        copyToClipboardFallback(shareText);
      });
    return true;
  }

  // 최후의 수단
  copyToClipboardFallback(shareText);
  return true;
}

function copyToClipboardFallback(text: string): void {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
    alert('클립보드에 복사되었습니다!');
  } catch (error) {
    console.error('Failed to copy:', error);
    alert('공유 기능을 사용할 수 없습니다. 텍스트를 수동으로 복사해주세요.');
  }

  document.body.removeChild(textarea);
}

