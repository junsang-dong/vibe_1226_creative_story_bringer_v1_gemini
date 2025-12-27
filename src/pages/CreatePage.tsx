import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoryInput } from '../components/StoryInput/StoryInput';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/i18n';
import { useStory } from '../hooks/useStory';
import type { UserInput } from '../types/story';

export function CreatePage() {
  const navigate = useNavigate();
  const { language } = useApp();
  const { createStory, isGenerating, error } = useStory();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (userInput: UserInput) => {
    setLocalError(null);
    console.log('Creating story with input:', userInput);
    
    try {
      const story = await createStory(userInput);
      console.log('Story created successfully:', story.id);
      
      // 스토리를 로컬 스토리지에 저장
      try {
        const { storageService } = await import('../services/storageService');
        await storageService.saveStory(story);
      } catch (saveError) {
        console.error('Failed to save story:', saveError);
        // 저장 실패해도 계속 진행
      }
      
      navigate(`/edit/${story.id}`);
    } catch (err) {
      console.error('Failed to create story:', err);
      const errorMessage = err instanceof Error ? err.message : '스토리 생성에 실패했습니다.';
      setLocalError(errorMessage);
      
      // API 키 확인
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        setLocalError('OpenAI API 키가 설정되지 않았습니다. .env.local 파일에 VITE_OPENAI_API_KEY를 설정해주세요.');
      }
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header title={t('app.title', language)} />
      <div className="flex-1 py-8">
        {displayError && (
          <div className="max-w-4xl mx-auto mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
            <h3 className="font-semibold mb-2">오류 발생</h3>
            <p>{displayError}</p>
            <details className="mt-2 text-sm">
              <summary className="cursor-pointer">자세한 정보</summary>
              <pre className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-xs overflow-auto">
                {JSON.stringify({ error: displayError, timestamp: new Date().toISOString() }, null, 2)}
              </pre>
            </details>
          </div>
        )}
        <StoryInput onSubmit={handleSubmit} isLoading={isGenerating} />
      </div>
      <Footer />
    </div>
  );
}

