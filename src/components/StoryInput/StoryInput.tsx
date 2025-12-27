import { useState, useCallback } from 'react';
import type { UserInput, Genre, DesignStyle } from '../../types/story';
import { StyleSelector } from './StyleSelector';
import { FileUpload } from './FileUpload';

interface StoryInputProps {
  onSubmit: (userInput: UserInput) => void;
  isLoading?: boolean;
}

export function StoryInput({ onSubmit, isLoading = false }: StoryInputProps) {
  const [storyLine, setStoryLine] = useState('');
  const [characters, setCharacters] = useState('');
  const [similarWorks, setSimilarWorks] = useState('');
  const [genre, setGenre] = useState<Genre>('fantasy');
  const [designStyle, setDesignStyle] = useState<DesignStyle>('anime');
  const [artist, setArtist] = useState('');
  const [director, setDirector] = useState('');
  const [uploadedText, setUploadedText] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const userInput: UserInput = {
        storyLine,
        characters,
        similarWorks,
        genre,
        designStyle,
        artist: artist || undefined,
        director: director || undefined,
        uploadedText: uploadedText || undefined,
      };

      onSubmit(userInput);
    },
    [storyLine, characters, similarWorks, genre, designStyle, artist, director, uploadedText, onSubmit]
  );

  const handleFileUpload = useCallback((text: string) => {
    setUploadedText(text);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Story Bringer</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="storyLine" className="block text-sm font-medium mb-2">
            스토리 라인 *
          </label>
          <textarea
            id="storyLine"
            value={storyLine}
            onChange={(e) => setStoryLine(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="스토리의 주요 내용을 입력해주세요..."
          />
        </div>

        <div>
          <label htmlFor="characters" className="block text-sm font-medium mb-2">
            등장 인물
          </label>
          <textarea
            id="characters"
            value={characters}
            onChange={(e) => setCharacters(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="주요 등장 인물과 그들의 특징을 설명해주세요..."
          />
        </div>

        <div>
          <label htmlFor="similarWorks" className="block text-sm font-medium mb-2">
            비슷한 작품
          </label>
          <input
            id="similarWorks"
            type="text"
            value={similarWorks}
            onChange={(e) => setSimilarWorks(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="참고하고 싶은 작품이나 스타일을 입력해주세요..."
          />
        </div>

        <StyleSelector
          genre={genre}
          designStyle={designStyle}
          onGenreChange={setGenre}
          onDesignStyleChange={setDesignStyle}
        />

        <div>
          <label htmlFor="artist" className="block text-sm font-medium mb-2">
            아티스트 (선택)
          </label>
          <input
            id="artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="참고하고 싶은 아티스트 스타일..."
          />
        </div>

        <div>
          <label htmlFor="director" className="block text-sm font-medium mb-2">
            디렉터 (선택)
          </label>
          <input
            id="director"
            type="text"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="참고하고 싶은 디렉터 스타일..."
          />
        </div>

        <FileUpload onFileUpload={handleFileUpload} uploadedText={uploadedText} />

        <button
          type="submit"
          disabled={isLoading || !storyLine.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? '스토리 생성 중...' : '스토리 생성하기'}
        </button>
      </form>
    </div>
  );
}

