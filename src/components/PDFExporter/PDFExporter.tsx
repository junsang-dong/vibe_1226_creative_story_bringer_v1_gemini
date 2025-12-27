import { useState } from 'react';
import type { Story } from '../../types/story';
import { generatePDF, downloadPDF } from '../../utils/pdfGenerator';

interface PDFExporterProps {
  story: Story;
}

export function PDFExporter({ story }: PDFExporterProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const blob = await generatePDF(story);
      downloadPDF(blob, story.title || 'story');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'PDF 생성에 실패했습니다.';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <button
        onClick={handleExport}
        disabled={isGenerating || story.images.length === 0}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'PDF 생성 중...' : 'PDF로 다운로드'}
      </button>
    </div>
  );
}

