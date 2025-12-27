export type Genre = 
  | 'fantasy'
  | 'romance'
  | 'mystery'
  | 'sci-fi'
  | 'horror'
  | 'comedy'
  | 'drama'
  | 'action'
  | 'slice-of-life'
  | 'historical';

export type DesignStyle = 
  | 'realistic'
  | 'anime'
  | 'manga'
  | 'watercolor'
  | 'digital-art'
  | 'sketch'
  | 'pixel-art'
  | 'minimalist';

export interface UserInput {
  storyLine: string;
  characters: string;
  similarWorks: string;
  genre: Genre;
  designStyle: DesignStyle;
  artist?: string;
  director?: string;
  uploadedText?: string;
}

export interface Image {
  id: string;
  url: string;
  prompt: string;
  chapterIndex: number;
  isCover: boolean;
  width: number;
  height: number;
  createdAt: string;
  textIndex?: number; // 텍스트 목록에서의 인덱스
  referenceImageId?: string; // 참조 이미지 ID (캐릭터 일관성용)
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  imageId?: string;
  order: number;
}

export interface Story {
  id: string;
  title: string;
  genre: Genre;
  designStyle: DesignStyle;
  artist?: string;
  director?: string;
  chapters: Chapter[];
  images: Image[];
  userInput: UserInput;
  recommendedTitles: string[];
  selectedTitle?: string;
  imageGenerationGuide?: string; // 이미지 생성 가이드 (예: "말 풍선 생성 금지")
  createdAt: string;
  updatedAt: string;
  isComplete: boolean;
}

export interface StoryMetadata {
  id: string;
  title: string;
  genre: Genre;
  createdAt: string;
  updatedAt: string;
  isComplete: boolean;
}

