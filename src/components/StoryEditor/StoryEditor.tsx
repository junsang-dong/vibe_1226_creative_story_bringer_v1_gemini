import { useState } from 'react';
import type { Story, Chapter } from '../../types/story';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/i18n';

interface StoryEditorProps {
  story: Story;
  onUpdateChapter: (chapterId: string, updates: Partial<Chapter>) => void;
  onAddChapter: (chapter: Omit<Chapter, 'id' | 'order'>) => void;
  onDeleteChapter: (chapterId: string) => void;
  onUpdateStory?: (updates: Partial<Story>) => void;
}

export function StoryEditor({
  story,
  onUpdateChapter,
  onAddChapter,
  onDeleteChapter,
  onUpdateStory,
}: StoryEditorProps) {
  const { language } = useApp();
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterContent, setNewChapterContent] = useState('');
  const [imageGenerationGuide, setImageGenerationGuide] = useState(story.imageGenerationGuide || '');

  const handleSaveChapter = (chapterId: string, title: string, content: string) => {
    onUpdateChapter(chapterId, { title, content });
    setEditingChapterId(null);
  };

  const handleAddChapter = () => {
    if (newChapterTitle.trim() && newChapterContent.trim()) {
      onAddChapter({
        title: newChapterTitle,
        content: newChapterContent,
      });
      setNewChapterTitle('');
      setNewChapterContent('');
    }
  };

  const handleGuideChange = (value: string) => {
    setImageGenerationGuide(value);
    if (onUpdateStory) {
      onUpdateStory({ imageGenerationGuide: value });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">스토리 편집</h2>

      {/* 이미지 생성 가이드 섹션 */}
      <div className="mb-8 border border-gray-300 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2">{t('storyEditor.imageGenerationGuide', language)}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {t('storyEditor.imageGenerationGuide.example', language)}
        </p>
        <textarea
          value={imageGenerationGuide}
          onChange={(e) => handleGuideChange(e.target.value)}
          placeholder={t('storyEditor.imageGenerationGuide.placeholder', language)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="space-y-6">
        {story.chapters.map((chapter) => (
          <div key={chapter.id} className="border border-gray-300 rounded-lg p-4">
            {editingChapterId === chapter.id ? (
              <ChapterEditForm
                chapter={chapter}
                onSave={(title, content) => handleSaveChapter(chapter.id, title, content)}
                onCancel={() => setEditingChapterId(null)}
              />
            ) : (
              <ChapterView
                chapter={chapter}
                onEdit={() => setEditingChapterId(chapter.id)}
                onDelete={() => onDeleteChapter(chapter.id)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 border border-gray-300 rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">새 챕터 추가</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={newChapterTitle}
            onChange={(e) => setNewChapterTitle(e.target.value)}
            placeholder="챕터 제목"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <textarea
            value={newChapterContent}
            onChange={(e) => setNewChapterContent(e.target.value)}
            placeholder="챕터 내용"
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={handleAddChapter}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            챕터 추가
          </button>
        </div>
      </div>
    </div>
  );
}

interface ChapterViewProps {
  chapter: Chapter;
  onEdit: () => void;
  onDelete: () => void;
}

function ChapterView({ chapter, onEdit, onDelete }: ChapterViewProps) {
  return (
    <div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold">{chapter.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            편집
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            삭제
          </button>
        </div>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{chapter.content}</p>
    </div>
  );
}

interface ChapterEditFormProps {
  chapter: Chapter;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
}

function ChapterEditForm({ chapter, onSave, onCancel }: ChapterEditFormProps) {
  const [title, setTitle] = useState(chapter.title);
  const [content, setContent] = useState(chapter.content);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onSave(title, content)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          저장
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          취소
        </button>
      </div>
    </div>
  );
}

