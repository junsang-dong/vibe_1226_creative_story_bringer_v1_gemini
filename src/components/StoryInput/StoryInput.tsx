import { useState, useCallback } from 'react';
import type { UserInput, Genre, DesignStyle } from '../../types/story';
import { StyleSelector } from './StyleSelector';
import { FileUpload } from './FileUpload';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/i18n';

interface StoryInputProps {
  onSubmit: (userInput: UserInput) => void;
  isLoading?: boolean;
}

export function StoryInput({ onSubmit, isLoading = false }: StoryInputProps) {
  const { language } = useApp();
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
            {t('storyInput.storyLine', language)} *
          </label>
          <textarea
            id="storyLine"
            value={storyLine}
            onChange={(e) => setStoryLine(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('storyInput.storyLine.placeholder', language)}
          />
        </div>

        <div>
          <label htmlFor="characters" className="block text-sm font-medium mb-2">
            {t('storyInput.characters', language)}
          </label>
          <textarea
            id="characters"
            value={characters}
            onChange={(e) => setCharacters(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('storyInput.characters.placeholder', language)}
          />
        </div>

        <div>
          <label htmlFor="similarWorks" className="block text-sm font-medium mb-2">
            {t('storyInput.similarWorks', language)}
          </label>
          <input
            id="similarWorks"
            type="text"
            value={similarWorks}
            onChange={(e) => setSimilarWorks(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('storyInput.similarWorks.placeholder', language)}
          />
        </div>

        <StyleSelector
          genre={genre}
          designStyle={designStyle}
          onGenreChange={setGenre}
          onDesignStyleChange={setDesignStyle}
          language={language}
        />

        <div>
          <label htmlFor="artist" className="block text-sm font-medium mb-2">
            {t('storyInput.artist', language)}
          </label>
          <input
            id="artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('storyInput.artist.placeholder', language)}
          />
        </div>

        <div>
          <label htmlFor="director" className="block text-sm font-medium mb-2">
            {t('storyInput.director', language)}
          </label>
          <input
            id="director"
            type="text"
            value={director}
            onChange={(e) => setDirector(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('storyInput.director.placeholder', language)}
          />
        </div>

        <FileUpload onFileUpload={handleFileUpload} uploadedText={uploadedText} language={language} />

        <button
          type="submit"
          disabled={isLoading || !storyLine.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? t('storyInput.generating', language) : t('storyInput.submit', language)}
        </button>
      </form>
    </div>
  );
}

