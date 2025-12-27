import type { Chapter } from '../types/story';

// 다양한 챕터 패턴 지원
// [CHAPTER: 제목], [CHAPTER 제목], CHAPTER: 제목, Chapter 1: 제목 등
const CHAPTER_PATTERNS = [
  /\[CHAPTER:\s*(.+?)\]\s*\n([\s\S]*?)(?=\[CHAPTER:|$)/gi,
  /\[CHAPTER\s+(.+?)\]\s*\n([\s\S]*?)(?=\[CHAPTER|$)/gi,
  /CHAPTER:\s*(.+?)\s*\n([\s\S]*?)(?=CHAPTER:|$)/gi,
  /Chapter\s+\d+:\s*(.+?)\s*\n([\s\S]*?)(?=Chapter\s+\d+:|$)/gi,
];

export function parseStory(storyText: string): Chapter[] {
  console.log('Parsing story text, length:', storyText.length);
  const chapters: Chapter[] = [];
  let matches: RegExpMatchArray[] = [];

  // 여러 패턴으로 시도
  for (const pattern of CHAPTER_PATTERNS) {
    const patternMatches = Array.from(storyText.matchAll(pattern));
    if (patternMatches.length > 0) {
      matches = patternMatches;
      console.log('Found chapters with pattern:', pattern, 'count:', matches.length);
      break;
    }
  }

  // 챕터 패턴이 없으면 문단 단위로 분할 시도
  if (matches.length === 0) {
    console.warn('No chapter pattern found, trying paragraph-based splitting');
    const paragraphs = storyText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    if (paragraphs.length > 1) {
      // 문단이 여러 개면 각각을 챕터로 처리
      paragraphs.forEach((paragraph, index) => {
        const lines = paragraph.trim().split('\n');
        const firstLine = lines[0]?.trim() || '';
        
        // 첫 줄이 제목처럼 보이면 제목으로 사용
        let title = `Chapter ${index + 1}`;
        let content = paragraph.trim();
        
        if (firstLine.length < 100 && firstLine.length > 0) {
          // 첫 줄이 짧으면 제목으로 간주
          title = firstLine.replace(/^#+\s*/, '').replace(/^CHAPTER\s*:?\s*/i, '').trim() || title;
          content = lines.slice(1).join('\n').trim() || firstLine;
        }
        
        if (content) {
          chapters.push({
            id: generateId(),
            title,
            content,
            order: index,
          });
        }
      });
    } else {
      // 문단이 하나면 전체를 하나의 챕터로 처리
      const trimmedText = storyText.trim();
      if (!trimmedText) {
        throw new Error('생성된 스토리가 비어있습니다.');
      }
      return [
        {
          id: generateId(),
          title: 'Chapter 1',
          content: trimmedText,
          order: 0,
        },
      ];
    }
  } else {
    // 패턴으로 찾은 챕터 처리
    matches.forEach((match, index) => {
      const title = match[1]?.trim() || `Chapter ${index + 1}`;
      const content = match[2]?.trim() || '';

      if (content) {
        chapters.push({
          id: generateId(),
          title,
          content,
          order: index,
        });
      } else {
        console.warn(`Chapter ${index + 1} has no content`);
      }
    });
  }

  if (chapters.length === 0) {
    throw new Error('파싱된 챕터가 없습니다. 스토리 형식을 확인해주세요.');
  }

  console.log('Parsed chapters:', chapters.length, chapters.map(c => c.title));
  return chapters;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatStoryForDisplay(chapters: Chapter[]): string {
  return chapters
    .map((chapter) => {
      return `[CHAPTER: ${chapter.title}]\n${chapter.content}`;
    })
    .join('\n\n');
}

