import type { Genre, DesignStyle } from '../../types/story';
import type { Language } from '../../contexts/AppContext';
import { t } from '../../utils/i18n';

const getGenreLabel = (value: Genre, language: Language): string => {
  const labels: Record<Language, Record<Genre, string>> = {
    ko: {
      fantasy: '판타지',
      romance: '로맨스',
      mystery: '미스터리',
      'sci-fi': 'SF',
      horror: '공포',
      comedy: '코미디',
      drama: '드라마',
      action: '액션',
      'slice-of-life': '일상',
      historical: '사극',
    },
    en: {
      fantasy: 'Fantasy',
      romance: 'Romance',
      mystery: 'Mystery',
      'sci-fi': 'Sci-Fi',
      horror: 'Horror',
      comedy: 'Comedy',
      drama: 'Drama',
      action: 'Action',
      'slice-of-life': 'Slice of Life',
      historical: 'Historical',
    },
    ja: {
      fantasy: 'ファンタジー',
      romance: 'ロマンス',
      mystery: 'ミステリー',
      'sci-fi': 'SF',
      horror: 'ホラー',
      comedy: 'コメディ',
      drama: 'ドラマ',
      action: 'アクション',
      'slice-of-life': '日常',
      historical: '時代劇',
    },
  };
  return labels[language][value];
};

const getDesignStyleLabel = (value: DesignStyle, language: Language): string => {
  const labels: Record<Language, Record<DesignStyle, string>> = {
    ko: {
      realistic: '사실적',
      anime: '애니메',
      manga: '만화',
      watercolor: '수채화',
      'digital-art': '디지털 아트',
      sketch: '스케치',
      'pixel-art': '픽셀 아트',
      minimalist: '미니멀',
    },
    en: {
      realistic: 'Realistic',
      anime: 'Anime',
      manga: 'Manga',
      watercolor: 'Watercolor',
      'digital-art': 'Digital Art',
      sketch: 'Sketch',
      'pixel-art': 'Pixel Art',
      minimalist: 'Minimalist',
    },
    ja: {
      realistic: '写実的',
      anime: 'アニメ',
      manga: '漫画',
      watercolor: '水彩画',
      'digital-art': 'デジタルアート',
      sketch: 'スケッチ',
      'pixel-art': 'ピクセルアート',
      minimalist: 'ミニマル',
    },
  };
  return labels[language][value];
};

interface StyleSelectorProps {
  genre: Genre;
  designStyle: DesignStyle;
  onGenreChange: (genre: Genre) => void;
  onDesignStyleChange: (style: DesignStyle) => void;
  language: Language;
}

const GENRES: Genre[] = ['fantasy', 'romance', 'mystery', 'sci-fi', 'horror', 'comedy', 'drama', 'action', 'slice-of-life', 'historical'];
const DESIGN_STYLES: DesignStyle[] = ['realistic', 'anime', 'manga', 'watercolor', 'digital-art', 'sketch', 'pixel-art', 'minimalist'];

export function StyleSelector({
  genre,
  designStyle,
  onGenreChange,
  onDesignStyleChange,
  language,
}: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-2">{t('storyInput.genre', language)} *</label>
        <select
          value={genre}
          onChange={(e) => onGenreChange(e.target.value as Genre)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {getGenreLabel(g, language)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">{t('storyInput.designStyle', language)} *</label>
        <select
          value={designStyle}
          onChange={(e) => onDesignStyleChange(e.target.value as DesignStyle)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {DESIGN_STYLES.map((s) => (
            <option key={s} value={s}>
              {getDesignStyleLabel(s, language)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

