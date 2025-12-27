import type { Story, StoryMetadata } from '../types/story';

const STORAGE_KEY = 'story_bringer_stories';
const STORAGE_METADATA_KEY = 'story_bringer_metadata';

export interface StorageService {
  saveStory(story: Story): Promise<void>;
  loadStory(id: string): Promise<Story | null>;
  getAllStories(): Promise<StoryMetadata[]>;
  deleteStory(id: string): Promise<void>;
}

class LocalStorageService implements StorageService {
  async saveStory(story: Story): Promise<void> {
    try {
      const stories = this.getAllStoriesSync();
      const existingIndex = stories.findIndex((s) => s.id === story.id);

      if (existingIndex >= 0) {
        stories[existingIndex] = story;
      } else {
        stories.push(story);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));

      // 메타데이터 업데이트
      const metadata = this.getMetadataSync();
      const metaIndex = metadata.findIndex((m) => m.id === story.id);

      const storyMeta: StoryMetadata = {
        id: story.id,
        title: story.title,
        genre: story.genre,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt,
        isComplete: story.isComplete,
      };

      if (metaIndex >= 0) {
        metadata[metaIndex] = storyMeta;
      } else {
        metadata.push(storyMeta);
      }

      localStorage.setItem(STORAGE_METADATA_KEY, JSON.stringify(metadata));
    } catch (error) {
      console.error('Failed to save story:', error);
      throw new Error('스토리 저장에 실패했습니다.');
    }
  }

  async loadStory(id: string): Promise<Story | null> {
    try {
      const stories = this.getAllStoriesSync();
      return stories.find((s) => s.id === id) || null;
    } catch (error) {
      console.error('Failed to load story:', error);
      return null;
    }
  }

  async getAllStories(): Promise<StoryMetadata[]> {
    try {
      return this.getMetadataSync();
    } catch (error) {
      console.error('Failed to load stories:', error);
      return [];
    }
  }

  async deleteStory(id: string): Promise<void> {
    try {
      const stories = this.getAllStoriesSync();
      const filtered = stories.filter((s) => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      const metadata = this.getMetadataSync();
      const filteredMeta = metadata.filter((m) => m.id !== id);
      localStorage.setItem(STORAGE_METADATA_KEY, JSON.stringify(filteredMeta));
    } catch (error) {
      console.error('Failed to delete story:', error);
      throw new Error('스토리 삭제에 실패했습니다.');
    }
  }

  private getAllStoriesSync(): Story[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data) as Story[];
    } catch {
      return [];
    }
  }

  private getMetadataSync(): StoryMetadata[] {
    const data = localStorage.getItem(STORAGE_METADATA_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data) as StoryMetadata[];
    } catch {
      return [];
    }
  }
}

export const storageService: StorageService = new LocalStorageService();

