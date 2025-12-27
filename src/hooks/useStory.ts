import { useState, useCallback } from 'react';
import type { Story, Chapter, UserInput } from '../types/story';
import { generateStory, recommendTitles } from '../services/gptService';
import { parseStory, generateId } from '../utils/storyParser';
import { useApp } from '../contexts/AppContext';

export function useStory() {
  const { language } = useApp();
  const [story, setStory] = useState<Story | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStory = useCallback(async (userInput: UserInput) => {
    setIsGenerating(true);
    setError(null);

    try {
      const storyText = await generateStory({ userInput, language });
      const chapters = parseStory(storyText);

      const newStory: Story = {
        id: generateId(),
        title: 'Untitled Story',
        genre: userInput.genre,
        designStyle: userInput.designStyle,
        artist: userInput.artist,
        director: userInput.director,
        chapters,
        images: [],
        userInput,
        recommendedTitles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isComplete: false,
      };

      setStory(newStory);
      return newStory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate story';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [language]);

  const generateRecommendedTitles = useCallback(async () => {
    if (!story) {
      throw new Error('No story available');
    }

    setIsGenerating(true);
    setError(null);

    try {
      const titles = await recommendTitles({ story, language });
      setStory((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          recommendedTitles: titles,
        };
      });
      return titles;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate titles';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [story, language]);

  const updateStory = useCallback((updates: Partial<Story>) => {
    setStory((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const updateChapter = useCallback((chapterId: string, updates: Partial<Chapter>) => {
    setStory((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        chapters: prev.chapters.map((ch) =>
          ch.id === chapterId ? { ...ch, ...updates } : ch
        ),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const addChapter = useCallback((chapter: Omit<Chapter, 'id' | 'order'>) => {
    setStory((prev) => {
      if (!prev) return null;
      const newChapter: Chapter = {
        ...chapter,
        id: generateId(),
        order: prev.chapters.length,
      };
      return {
        ...prev,
        chapters: [...prev.chapters, newChapter],
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const deleteChapter = useCallback((chapterId: string) => {
    setStory((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        chapters: prev.chapters
          .filter((ch) => ch.id !== chapterId)
          .map((ch, index) => ({ ...ch, order: index })),
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const selectTitle = useCallback((title: string) => {
    updateStory({ title, selectedTitle: title });
  }, [updateStory]);

  const loadStory = useCallback((loadedStory: Story) => {
    setStory(loadedStory);
  }, []);

  return {
    story,
    isGenerating,
    error,
    createStory,
    generateRecommendedTitles,
    updateStory,
    updateChapter,
    addChapter,
    deleteChapter,
    selectTitle,
    loadStory,
  };
}

