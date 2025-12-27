import { useEffect, useRef } from 'react';
import type { Story } from '../types/story';
import { storageService } from '../services/storageService';

export function useAutoSave(story: Story | null, debounceMs: number = 2000) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!story) return;

    // 스토리가 변경되지 않았으면 저장하지 않음
    const storyKey = `${story.id}-${story.updatedAt}`;
    if (storyKey === lastSavedRef.current) return;

    // 기존 타이머 취소
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 새 타이머 설정
    timeoutRef.current = setTimeout(async () => {
      try {
        await storageService.saveStory(story);
        lastSavedRef.current = storyKey;
        console.log('Auto-saved story:', story.id);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [story, debounceMs]);
}

