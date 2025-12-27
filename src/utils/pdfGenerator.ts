import jsPDF from 'jspdf';
import type { Story } from '../types/story';

export async function generatePDF(story: Story): Promise<Blob> {
  // 1:1 비율로 변경 (210mm x 210mm)
  const pdf = new jsPDF('p', 'mm', [210, 210]); // portrait, mm 단위, 210x210mm (1:1 비율)

  // 표지 이미지
  const coverImage = story.images.find((img) => img.isCover);
  if (coverImage) {
    await addImageToPDF(pdf, coverImage.url, 0, 0, 210, 210);
  }

  // 텍스트 기반 이미지들 처리 (textIndex가 있는 이미지들)
  const textBasedImages = story.images
    .filter((img) => !img.isCover && img.textIndex !== undefined && img.textIndex >= 0)
    .sort((a, b) => (a.textIndex || 0) - (b.textIndex || 0));

  for (const image of textBasedImages) {
    if (coverImage && image.id === coverImage.id) continue; // 표지는 이미 추가됨
    
    pdf.addPage();
    await addImageToPDF(pdf, image.url, 0, 0, 210, 210);
  }

  // 기존 챕터 기반 이미지들 처리 (하위 호환성)
  for (let i = 0; i < story.chapters.length; i++) {
    const chapter = story.chapters[i];
    const chapterImage = story.images.find(
      (img) => img.chapterIndex === i && !img.isCover && img.textIndex === undefined
    );

    if (chapterImage) {
      pdf.addPage();
      await addImageToPDF(pdf, chapterImage.url, 0, 0, 210, 210);
      pdf.addPage();
    }

    // 챕터 텍스트
    pdf.setFontSize(16);
    pdf.text(chapter.title, 10, 20);

    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(chapter.content, 190);
    let y = 30;

    for (const line of lines) {
      if (y > 200) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(line, 10, y);
      y += 7;
    }
  }

  return pdf.output('blob');
}

async function addImageToPDF(
  pdf: jsPDF,
  imageUrl: string,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        pdf.addImage(img, 'JPEG', x, y, width, height);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

export function downloadPDF(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

