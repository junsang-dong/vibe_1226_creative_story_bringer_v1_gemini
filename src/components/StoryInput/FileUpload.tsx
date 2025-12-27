import { useState, useCallback, useRef } from 'react';

interface FileUploadProps {
  onFileUpload: (text: string) => void;
  uploadedText: string;
}

export function FileUpload({ onFileUpload, uploadedText }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
        alert('텍스트 파일(.txt)만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileUpload(text);
      };
      reader.onerror = () => {
        alert('파일 읽기 중 오류가 발생했습니다.');
      };
      reader.readAsText(file);
    },
    [onFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium mb-2">텍스트 파일 업로드 (선택)</label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,text/plain"
          onChange={handleFileInput}
          className="hidden"
        />
        <p className="text-gray-600">
          {uploadedText
            ? '파일이 업로드되었습니다. 클릭하여 다른 파일로 변경할 수 있습니다.'
            : '텍스트 파일을 드래그 앤 드롭하거나 클릭하여 업로드하세요'}
        </p>
        {uploadedText && (
          <p className="mt-2 text-sm text-gray-500">
            업로드된 텍스트 길이: {uploadedText.length}자
          </p>
        )}
      </div>
    </div>
  );
}

