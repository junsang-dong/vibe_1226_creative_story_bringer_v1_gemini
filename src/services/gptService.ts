import axios from 'axios';
import type { UserInput, Story } from '../types/story';
import type { Language } from '../contexts/AppContext';
import { getStoryPrompt, getTitlePrompt } from '../utils/i18n';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export interface StoryGenerationOptions {
  userInput: UserInput;
  model?: string;
  language?: Language;
}

export interface TitleRecommendationOptions {
  story: Story;
  model?: string;
  language?: Language;
}

export async function generateStory(options: StoryGenerationOptions): Promise<string> {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key is missing');
    throw new Error('OpenAI API 키가 설정되지 않았습니다. .env.local 파일에 VITE_OPENAI_API_KEY를 설정해주세요.');
  }

  const { userInput, model = 'gpt-3.5-turbo', language = 'en' } = options;
  
  console.log('Generating story with model:', model, 'language:', language);

  const basePrompt = getStoryPrompt(language);
  const genreLabel = language === 'ko' ? '장르' : language === 'ja' ? 'ジャンル' : 'Genre';
  const storyLineLabel = language === 'ko' ? '스토리 라인' : language === 'ja' ? 'ストーリーライン' : 'Story Line';
  const charactersLabel = language === 'ko' ? '등장 인물' : language === 'ja' ? '登場人物' : 'Characters';
  const similarWorksLabel = language === 'ko' ? '참고 작품' : language === 'ja' ? '参考作品' : 'Similar Works';
  const artistLabel = language === 'ko' ? '아티스트 스타일' : language === 'ja' ? 'アーティストスタイル' : 'Artist Style';
  const directorLabel = language === 'ko' ? '디렉터 스타일' : language === 'ja' ? 'ディレクタースタイル' : 'Director Style';
  const additionalTextLabel = language === 'ko' ? '추가 텍스트' : language === 'ja' ? '追加テキスト' : 'Additional Text';

  const prompt = `${basePrompt}

${genreLabel}: ${userInput.genre}
${storyLineLabel}: ${userInput.storyLine}
${charactersLabel}: ${userInput.characters}
${similarWorksLabel}: ${userInput.similarWorks}
${userInput.artist ? `${artistLabel}: ${userInput.artist}` : ''}
${userInput.director ? `${directorLabel}: ${userInput.director}` : ''}
${userInput.uploadedText ? `${additionalTextLabel}:\n${userInput.uploadedText}` : ''}`;

  try {
    console.log('Sending request to OpenAI API...');
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model,
        messages: [
          {
            role: 'system',
            content: language === 'ko' 
              ? '당신은 전문 그래픽 노블 작가입니다. 창의적이고 감동적인 스토리를 작성합니다.'
              : language === 'ja'
              ? 'あなたはプロのグラフィックノベル作家です。創造的で感動的なストーリーを書きます。'
              : 'You are a professional graphic novel writer. You write creative and moving stories.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000, // 60초 타임아웃
      }
    );

    console.log('OpenAI API response received');
    const storyText = response.data.choices[0]?.message?.content;
    if (!storyText) {
      console.error('No story text in response:', response.data);
      throw new Error('스토리 생성에 실패했습니다. 응답에 내용이 없습니다.');
    }

    console.log('Story generated successfully, length:', storyText.length);
    return storyText;
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      const statusCode = error.response?.status;
      
      if (statusCode === 401) {
        throw new Error('OpenAI API 키가 유효하지 않습니다. API 키를 확인해주세요.');
      } else if (statusCode === 429) {
        throw new Error('API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      } else if (statusCode === 500) {
        throw new Error('OpenAI 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      throw new Error(`OpenAI API 오류: ${errorMessage}`);
    }
    throw error;
  }
}

export async function recommendTitles(options: TitleRecommendationOptions): Promise<string[]> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const { story, model = 'gpt-4', language = 'en' } = options;

  const basePrompt = getTitlePrompt(language);
  const genreLabel = language === 'ko' ? '장르' : language === 'ja' ? 'ジャンル' : 'Genre';
  const summaryLabel = language === 'ko' ? '스토리 요약' : language === 'ja' ? 'ストーリー要約' : 'Story Summary';

  const prompt = `${basePrompt}

${genreLabel}: ${story.genre}
${summaryLabel}:
${story.chapters.map((ch, idx) => `${idx + 1}. ${ch.title}: ${ch.content.substring(0, 100)}...`).join('\n')}`;

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model,
        messages: [
          {
            role: 'system',
            content: language === 'ko'
              ? '당신은 전문 출판 편집자입니다. 매력적이고 기억에 남는 제목을 추천합니다.'
              : language === 'ja'
              ? 'あなたはプロの出版編集者です。魅力的で記憶に残るタイトルを推薦します。'
              : 'You are a professional publishing editor. You recommend attractive and memorable titles.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.9,
        max_tokens: 400,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const titlesText = response.data.choices[0]?.message?.content;
    if (!titlesText) {
      throw new Error('Failed to generate titles');
    }

    const titles = titlesText
      .split('\n')
      .map((title: string) => title.trim())
      .filter((title: string) => title.length > 0)
      .slice(0, 6);

    return titles;
  } catch (error) {
    console.error('OpenAI API error (titles):', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      const statusCode = error.response?.status;
      
      if (statusCode === 401) {
        throw new Error('OpenAI API 키가 유효하지 않습니다. API 키를 확인해주세요.');
      } else if (statusCode === 429) {
        throw new Error('API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
      }
      
      throw new Error(`OpenAI API 오류: ${errorMessage}`);
    }
    throw error;
  }
}

