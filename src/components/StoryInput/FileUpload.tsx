import { useState, useCallback, useRef } from 'react';
import type { Language } from '../../contexts/AppContext';
import { t } from '../../utils/i18n';

interface FileUploadProps {
  onFileUpload: (text: string) => void;
  uploadedText: string;
  language: Language;
}

export function FileUpload({ onFileUpload, uploadedText, language }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

      const handleFile = useCallback(
    (file: File) => {
      if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
        alert(t('storyInput.fileUpload.error', language));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onFileUpload(text);
      };
      reader.onerror = () => {
        alert(t('storyInput.fileUpload.readError', language));
      };
      reader.readAsText(file);
    },
    [onFileUpload, language]
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
      <label className="block text-sm font-medium mb-2">{t('storyInput.fileUpload', language)}</label>
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
            ? t('storyInput.fileUpload.uploaded', language)
            : t('storyInput.fileUpload.dragDrop', language)}
        </p>
        {uploadedText && (
          <p className="mt-2 text-sm text-gray-500">
            {t('storyInput.fileUpload.length', language)} {uploadedText.length}
          </p>
        )}
      </div>
    </div>
  );
}

