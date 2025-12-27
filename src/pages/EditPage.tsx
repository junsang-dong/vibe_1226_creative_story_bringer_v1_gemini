import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoryEditor } from '../components/StoryEditor/StoryEditor';
import { TitleRecommender } from '../components/TitleRecommender/TitleRecommender';
import { ImageGenerator } from '../components/ImageGenerator/ImageGenerator';
import { Preview } from '../components/Preview/Preview';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { useStory } from '../hooks/useStory';
import { useAutoSave } from '../hooks/useAutoSave';
import { useApp } from '../contexts/AppContext';
import { t } from '../utils/i18n';
import { storageService } from '../services/storageService';
import { generatePPT } from '../utils/pptGenerator';
import type { Image } from '../types/story';

export function EditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useApp();
  const { story, updateStory, updateChapter, addChapter, deleteChapter, selectTitle, generateRecommendedTitles, isGenerating, loadStory: setStory } = useStory();
  const [activeTab, setActiveTab] = useState<'editor' | 'title' | 'images' | 'preview'>('editor');

  useAutoSave(story);

  useEffect(() => {
    if (id) {
      loadStory(id);
    }
  }, [id]);

  const loadStory = async (storyId: string) => {
    try {
      const loadedStory = await storageService.loadStory(storyId);
      if (loadedStory) {
        setStory(loadedStory);
      } else {
        navigate('/create');
      }
    } catch (error) {
      console.error('Failed to load story:', error);
      navigate('/create');
    }
  };

  const handleImagesGenerated = (images: Image[]) => {
    console.log('handleImagesGenerated called with', images.length, 'images');
    if (story) {
      console.log('Updating story with images:', images.map(img => ({ id: img.id, url: img.url.substring(0, 50) })));
      updateStory({ images });
    }
  };

  const handleImageUpdate = (imageId: string, newImage: Image) => {
    if (story) {
      // 기존 이미지가 있으면 업데이트, 없으면 추가
      const existingIndex = story.images.findIndex(img => img.id === imageId);
      if (existingIndex >= 0) {
        const updatedImages = story.images.map((img) =>
          img.id === imageId ? newImage : img
        );
        updateStory({ images: updatedImages });
      } else {
        updateStory({ images: [...story.images, newImage] });
      }
    }
  };

  const handleCoverSelected = (imageId: string) => {
    if (story) {
      // 모든 이미지의 isCover를 false로 설정하고, 선택된 이미지만 true로 설정
      const updatedImages = story.images.map((img) => ({
        ...img,
        isCover: img.id === imageId,
      }));
      updateStory({ images: updatedImages });
    }
  };

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p>스토리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header
        title={story.title}
      >
        <button
          onClick={async () => {
            if (!story) return;
            try {
              const filename = `StoryBringer_${story.title || 'story'}`;
              await generatePPT(story, filename);
            } catch (err) {
              console.error('PPT export failed:', err);
              alert('PPT 내보내기에 실패했습니다.');
            }
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          {t('header.export', language)}
        </button>
        <button
          onClick={() => navigate('/create')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          {t('header.newStory', language)}
        </button>
      </Header>
      
      <div className="bg-gray-600 dark:bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4 border-t border-gray-500">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 border-b-2 ${
                activeTab === 'editor'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
              >
              {t('tabs.storyEdit', language)}
            </button>
            <button
              onClick={() => setActiveTab('title')}
              className={`px-4 py-2 border-b-2 ${
                activeTab === 'title'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              {t('tabs.titleRecommend', language)}
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`px-4 py-2 border-b-2 ${
                activeTab === 'images'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              {t('tabs.imageGenerate', language)}
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 border-b-2 ${
                activeTab === 'preview'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-300 hover:text-white'
              }`}
            >
              {t('tabs.preview', language)}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full py-8 px-4">
        {activeTab === 'editor' && (
          <StoryEditor
            story={story}
            onUpdateChapter={updateChapter}
            onAddChapter={addChapter}
            onDeleteChapter={deleteChapter}
            onUpdateStory={updateStory}
          />
        )}

        {activeTab === 'title' && (
          <TitleRecommender
            story={story}
            recommendedTitles={story.recommendedTitles}
            selectedTitle={story.selectedTitle}
            onSelectTitle={selectTitle}
            onGenerateTitles={generateRecommendedTitles}
            isGenerating={isGenerating}
          />
        )}

        {activeTab === 'images' && (
          <ImageGenerator
            story={story}
            onImagesGenerated={handleImagesGenerated}
            onImageUpdate={handleImageUpdate}
            onCoverSelected={handleCoverSelected}
          />
        )}

        {activeTab === 'preview' && (
          <div className="h-screen">
            <Preview story={story} onClose={() => setActiveTab('images')} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

