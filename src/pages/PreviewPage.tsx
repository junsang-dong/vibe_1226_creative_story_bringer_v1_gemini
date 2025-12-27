import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Preview } from '../components/Preview/Preview';
import { storageService } from '../services/storageService';
import type { Story } from '../types/story';

export function PreviewPage() {
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
    <Preview story={story} onClose={() => navigate(`/edit/${story.id}`)} />
  );
}

