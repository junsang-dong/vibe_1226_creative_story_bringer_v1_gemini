import PptxGenJS from 'pptxgenjs';
import type { Story } from '../types/story';

// 이미지를 base64로 변환
function imageToBase64(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      try {
        const base64 = canvas.toDataURL('image/png');
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

// 데스크톱 모드 레이아웃으로 PPT 슬라이드 생성
export async function generatePPT(story: Story, filename?: string): Promise<void> {
  const pptx = new PptxGenJS();
  
  // 슬라이드 크기 설정 (16:9 비율)
  pptx.layout = 'LAYOUT_WIDE'; // 16:9 비율
  pptx.defineLayout({ name: 'LAYOUT_WIDE', width: 10, height: 5.625 }); // 인치 단위

  // 스토리 텍스트 목록 생성 (Preview와 동일한 로직)
  const storyTexts = story.chapters.map((chapter, index) => ({
    index,
    text: chapter.content,
    title: chapter.title,
    chapterId: chapter.id,
  }));

  // 표지 이미지 처리
  const coverImage = story.images.find((img) => img.isCover);
  if (coverImage) {
    const slide = pptx.addSlide();
    
    try {
      const imageBase64 = await imageToBase64(coverImage.url);
      
      // 좌측: 이미지 (60% 너비)
      slide.addImage({
        data: imageBase64,
        x: 0,
        y: 0,
        w: 6,
        h: 5.625,
        sizing: { type: 'contain', w: 6, h: 5.625 },
      });
      
      // 우측: 텍스트 (40% 너비)
      slide.addText(story.title, {
        x: 6.2,
        y: 0.5,
        w: 3.6,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: '363636',
        align: 'left',
        valign: 'top',
      });
      
      slide.addText('표지', {
        x: 6.2,
        y: 1.5,
        w: 3.6,
        h: 4,
        fontSize: 18,
        color: '666666',
        align: 'left',
        valign: 'top',
      });
    } catch (error) {
      console.error('Failed to add cover image:', error);
      // 이미지 실패 시 텍스트만 추가
      slide.addText(story.title, {
        x: 0.5,
        y: 2,
        w: 9,
        h: 1.5,
        fontSize: 48,
        bold: true,
        color: '363636',
        align: 'center',
        valign: 'middle',
      });
    }
  }

  // 텍스트 기반 이미지들 처리
  const textBasedImages = story.images
    .filter((img) => !img.isCover && img.textIndex !== undefined && img.textIndex >= 0)
    .sort((a, b) => (a.textIndex || 0) - (b.textIndex || 0));

  for (const image of textBasedImages) {
    if (coverImage && image.id === coverImage.id) continue; // 표지는 이미 추가됨
    
    const slide = pptx.addSlide();
    const textItem = storyTexts[image.textIndex || 0];
    
    try {
      const imageBase64 = await imageToBase64(image.url);
      
      // 좌측: 이미지 (60% 너비)
      slide.addImage({
        data: imageBase64,
        x: 0,
        y: 0,
        w: 6,
        h: 5.625,
        sizing: { type: 'contain', w: 6, h: 5.625 },
      });
      
      // 우측: 텍스트 (40% 너비)
      if (textItem) {
        slide.addText(textItem.title, {
          x: 6.2,
          y: 0.5,
          w: 3.6,
          h: 0.8,
          fontSize: 28,
          bold: true,
          color: '363636',
          align: 'left',
          valign: 'top',
        });
        
        slide.addText(textItem.text, {
          x: 6.2,
          y: 1.5,
          w: 3.6,
          h: 4,
          fontSize: 14,
          color: '666666',
          align: 'left',
          valign: 'top',
          lineSpacing: 24,
        });
      }
    } catch (error) {
      console.error('Failed to add image:', error);
      // 이미지 실패 시 텍스트만 추가
      if (textItem) {
        slide.addText(textItem.title, {
          x: 0.5,
          y: 1,
          w: 9,
          h: 0.8,
          fontSize: 32,
          bold: true,
          color: '363636',
          align: 'center',
          valign: 'top',
        });
        
        slide.addText(textItem.text, {
          x: 0.5,
          y: 2,
          w: 9,
          h: 3.5,
          fontSize: 16,
          color: '666666',
          align: 'left',
          valign: 'top',
          lineSpacing: 24,
        });
      }
    }
  }

  // PPT 파일 생성 및 다운로드
  // pptxgenjs의 writeFile은 자동으로 파일을 다운로드합니다
  await pptx.writeFile({ fileName: filename || 'story.pptx' });
}

