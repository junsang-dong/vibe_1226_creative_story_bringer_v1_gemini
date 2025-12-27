import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Reader } from '../components/Reader/Reader';
import { storageService } from '../services/storageService';
import type { Story } from '../types/story';
import { shareStory } from '../utils/socialShare';

export function ReadPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (story) {
      await shareStory(
        story.title,
        `${story.chapters.length}개의 챕터로 구성된 ${story.genre} 장르의 그래픽 노블`,
        window.location.href
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p>스토리를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  return (
    <div>
      <Reader story={story} onClose={() => navigate(`/edit/${story.id}`)} />
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleShare}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700"
        >
          공유하기
        </button>
      </div>
    </div>
  );
}

