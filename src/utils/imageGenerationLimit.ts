// 이미지 생성 횟수 제한 유틸리티
// 1인당 하루 최대 12개로 제한

const STORAGE_KEY = 'story_bringer_image_generation_limit';
const DAILY_LIMIT = 12;

interface GenerationLimitData {
  date: string; // YYYY-MM-DD 형식
  count: number; // 오늘 생성한 이미지 개수
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * 현재 이미지 생성 횟수 가져오기
 */
export function getCurrentGenerationCount(): number {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return 0;
    
    const limitData: GenerationLimitData = JSON.parse(data);
    const today = getTodayDateString();
    
    // 날짜가 다르면 카운터 리셋
    if (limitData.date !== today) {
      return 0;
    }
    
    return limitData.count || 0;
  } catch (error) {
    console.error('Failed to get generation count:', error);
    return 0;
  }
}

/**
 * 이미지 생성 횟수 증가
 */
export function incrementGenerationCount(): void {
  try {
    const today = getTodayDateString();
    const currentCount = getCurrentGenerationCount();
    
    const limitData: GenerationLimitData = {
      date: today,
      count: currentCount + 1,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitData));
  } catch (error) {
    console.error('Failed to increment generation count:', error);
  }
}

/**
 * 이미지 생성 가능 여부 확인
 */
export function canGenerateImage(): boolean {
  const currentCount = getCurrentGenerationCount();
  return currentCount < DAILY_LIMIT;
}

/**
 * 남은 이미지 생성 횟수 가져오기
 */
export function getRemainingGenerationCount(): number {
  const currentCount = getCurrentGenerationCount();
  return Math.max(0, DAILY_LIMIT - currentCount);
}

/**
 * 일일 제한 횟수 가져오기
 */
export function getDailyLimit(): number {
  return DAILY_LIMIT;
}

