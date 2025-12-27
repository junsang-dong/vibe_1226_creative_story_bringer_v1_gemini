import type { Genre, DesignStyle } from '../../types/story';

interface StyleSelectorProps {
  genre: Genre;
  designStyle: DesignStyle;
  onGenreChange: (genre: Genre) => void;
  onDesignStyleChange: (style: DesignStyle) => void;
}

const GENRES: { value: Genre; label: string }[] = [
  { value: 'fantasy', label: '판타지' },
  { value: 'romance', label: '로맨스' },
  { value: 'mystery', label: '미스터리' },
  { value: 'sci-fi', label: 'SF' },
  { value: 'horror', label: '공포' },
  { value: 'comedy', label: '코미디' },
  { value: 'drama', label: '드라마' },
  { value: 'action', label: '액션' },
  { value: 'slice-of-life', label: '일상' },
  { value: 'historical', label: '사극' },
];

const DESIGN_STYLES: { value: DesignStyle; label: string }[] = [
  { value: 'realistic', label: '사실적' },
  { value: 'anime', label: '애니메' },
  { value: 'manga', label: '만화' },
  { value: 'watercolor', label: '수채화' },
  { value: 'digital-art', label: '디지털 아트' },
  { value: 'sketch', label: '스케치' },
  { value: 'pixel-art', label: '픽셀 아트' },
  { value: 'minimalist', label: '미니멀' },
];

export function StyleSelector({
  genre,
  designStyle,
  onGenreChange,
  onDesignStyleChange,
}: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium mb-2">장르 *</label>
        <select
          value={genre}
          onChange={(e) => onGenreChange(e.target.value as Genre)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {GENRES.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">디자인 스타일 *</label>
        <select
          value={designStyle}
          onChange={(e) => onDesignStyleChange(e.target.value as DesignStyle)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {DESIGN_STYLES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

