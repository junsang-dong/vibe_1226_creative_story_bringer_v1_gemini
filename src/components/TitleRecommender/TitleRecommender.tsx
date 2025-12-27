import { useState } from 'react';
import type { Story } from '../../types/story';

interface TitleRecommenderProps {
  story: Story;
  recommendedTitles: string[];
  selectedTitle?: string;
  onSelectTitle: (title: string) => void;
  onGenerateTitles: () => void;
  isGenerating: boolean;
}

export function TitleRecommender({
  story,
  recommendedTitles,
  selectedTitle,
  onSelectTitle,
  onGenerateTitles,
  isGenerating,
}: TitleRecommenderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(selectedTitle || story.title || '');
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">제목 추천</h2>

      {recommendedTitles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">스토리 제목을 추천받으시겠습니까?</p>
          <button
            onClick={onGenerateTitles}
            disabled={isGenerating}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isGenerating ? '제목 생성 중...' : '제목 추천받기'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600 mb-4">추천된 제목 중 하나를 선택하세요:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedTitles.map((title, index) => (
              <button
                key={index}
                onClick={() => onSelectTitle(title)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  selectedTitle === title
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="font-semibold text-lg mb-2">{title}</div>
                {selectedTitle === title && (
                  <div className="text-sm text-blue-600">✓ 선택됨</div>
                )}
              </button>
            ))}
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={onGenerateTitles}
              disabled={isGenerating}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {isGenerating ? '재생성 중...' : '다른 제목 추천받기'}
            </button>
            {selectedTitle && (
              <>
                <button
                  onClick={() => {
                    setEditedTitle(selectedTitle || '');
                    setIsEditing(true);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  제목 수정하기
                </button>
                <button
                  onClick={() => onSelectTitle(selectedTitle)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  이 제목으로 결정
                </button>
              </>
            )}
          </div>
          
          {isEditing && (
            <div className="mt-6 p-4 bg-white border-2 border-blue-300 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">제목 수정</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (editedTitle.trim()) {
                        onSelectTitle(editedTitle.trim());
                        setIsEditing(false);
                      }
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setEditedTitle(selectedTitle || story.title || '');
                      setIsEditing(false);
                    }}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {story.title && story.title !== 'Untitled Story' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            현재 선택된 제목: <span className="font-semibold">{story.title}</span>
          </p>
        </div>
      )}
    </div>
  );
}

