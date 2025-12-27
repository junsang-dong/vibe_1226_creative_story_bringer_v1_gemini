import type { Language } from '../contexts/AppContext';

type TranslationKey = 
  | 'app.title'
  | 'header.export'
  | 'header.newStory'
  | 'header.settings'
  | 'tabs.storyEdit'
  | 'tabs.titleRecommend'
  | 'tabs.imageGenerate'
  | 'tabs.preview'
  | 'settings.theme'
  | 'settings.theme.light'
  | 'settings.theme.dark'
  | 'settings.language'
  | 'settings.language.ko'
  | 'settings.language.en'
  | 'settings.language.ja'
  | 'storyInput.title'
  | 'storyInput.description'
  | 'storyInput.submit'
  | 'storyInput.storyLine'
  | 'storyInput.storyLine.placeholder'
  | 'storyInput.characters'
  | 'storyInput.characters.placeholder'
  | 'storyInput.similarWorks'
  | 'storyInput.similarWorks.placeholder'
  | 'storyInput.genre'
  | 'storyInput.designStyle'
  | 'storyInput.artist'
  | 'storyInput.artist.placeholder'
  | 'storyInput.director'
  | 'storyInput.director.placeholder'
  | 'storyInput.generating'
  | 'storyInput.fileUpload'
  | 'storyInput.fileUpload.dragDrop'
  | 'storyInput.fileUpload.uploaded'
  | 'storyInput.fileUpload.length'
  | 'storyInput.fileUpload.error'
  | 'storyInput.fileUpload.readError'
  | 'titleRecommender.title'
  | 'titleRecommender.generate'
  | 'titleRecommender.select'
  | 'titleRecommender.edit'
  | 'titleRecommender.save'
  | 'titleRecommender.cancel'
  | 'titleRecommender.decide'
  | 'titleRecommender.regenerate'
  | 'imageGenerator.title'
  | 'imageGenerator.imageList'
  | 'imageGenerator.textList'
  | 'imageGenerator.selectCover'
  | 'imageGenerator.regenerate'
  | 'imageGenerator.selectText'
  | 'imageGenerator.generating'
  | 'imageGenerator.noImage'
  | 'preview.mobile'
  | 'preview.desktop'
  | 'preview.fullscreen'
  | 'preview.exit'
  | 'preview.close'
  | 'preview.prev'
  | 'preview.next'
  | 'preview.cover'
  | 'preview.story'
  | 'footer.education'
  | 'footer.techStack'
  | 'footer.developer'
  | 'storyEditor.title'
  | 'storyEditor.imageGenerationGuide'
  | 'storyEditor.imageGenerationGuide.placeholder'
  | 'storyEditor.imageGenerationGuide.example'
  | 'titleRecommender.currentTitle'
  | 'titleRecommender.selected'
  | 'titleRecommender.editing'
  | 'titleRecommender.prompt'
  | 'imageGenerator.remainingCount'
  | 'imageGenerator.model'
  | 'imageGenerator.imageGenerated'
  | 'preview.storyNumber'
  | 'common.loading'
  | 'common.error'
  | 'common.success';

const translations: Record<Language, Record<TranslationKey, string>> = {
  ko: {
    'app.title': 'Story Bringer',
    'header.export': '내보내기',
    'header.newStory': '새 스토리',
    'header.settings': '설정',
    'tabs.storyEdit': '스토리 편집',
    'tabs.titleRecommend': '제목 추천',
    'tabs.imageGenerate': '이미지 생성',
    'tabs.preview': '미리보기',
    'settings.theme': '디자인 테마',
    'settings.theme.light': '라이트',
    'settings.theme.dark': '다크',
    'settings.language': '언어',
    'settings.language.ko': '한국어',
    'settings.language.en': '영어',
    'settings.language.ja': '일본어',
    'storyInput.title': '스토리 입력',
    'storyInput.description': 'GPT와 Gemini의 최신 기능을 활용한 그래픽 노블 작성 도구',
    'storyInput.submit': '스토리 생성하기',
    'storyInput.storyLine': '스토리 라인',
    'storyInput.storyLine.placeholder': '스토리의 주요 내용을 입력해주세요...',
    'storyInput.characters': '등장 인물',
    'storyInput.characters.placeholder': '주요 등장 인물과 그들의 특징을 설명해주세요...',
    'storyInput.similarWorks': '비슷한 작품',
    'storyInput.similarWorks.placeholder': '참고하고 싶은 작품이나 스타일을 입력해주세요...',
    'storyInput.genre': '장르',
    'storyInput.designStyle': '디자인 스타일',
    'storyInput.artist': '아티스트 (선택)',
    'storyInput.artist.placeholder': '참고하고 싶은 아티스트 스타일...',
    'storyInput.director': '디렉터 (선택)',
    'storyInput.director.placeholder': '참고하고 싶은 디렉터 스타일...',
    'storyInput.generating': '스토리 생성 중...',
    'storyInput.fileUpload': '텍스트 파일 업로드 (선택)',
    'storyInput.fileUpload.dragDrop': '텍스트 파일을 드래그 앤 드롭하거나 클릭하여 업로드하세요',
    'storyInput.fileUpload.uploaded': '파일이 업로드되었습니다. 클릭하여 다른 파일로 변경할 수 있습니다.',
    'storyInput.fileUpload.length': '업로드된 텍스트 길이:',
    'storyInput.fileUpload.error': '텍스트 파일(.txt)만 업로드 가능합니다.',
    'storyInput.fileUpload.readError': '파일 읽기 중 오류가 발생했습니다.',
    'storyEditor.title': '스토리 편집',
    'storyEditor.imageGenerationGuide': '이미지 생성 가이드',
    'storyEditor.imageGenerationGuide.placeholder': '이미지 생성 시 공통적으로 적용할 가이드를 입력하세요...',
    'storyEditor.imageGenerationGuide.example': '예: 말 풍선 생성 금지, 텍스트 포함하지 않기 등',
    'titleRecommender.title': '제목 추천',
    'titleRecommender.generate': '제목 추천받기',
    'titleRecommender.select': '추천된 제목 중 하나를 선택하세요:',
    'titleRecommender.edit': '제목 수정하기',
    'titleRecommender.save': '저장',
    'titleRecommender.cancel': '취소',
    'titleRecommender.decide': '이 제목으로 결정',
    'titleRecommender.regenerate': '다른 제목 추천받기',
    'titleRecommender.currentTitle': '현재 선택된 제목:',
    'titleRecommender.selected': '선택됨',
    'titleRecommender.editing': '제목 수정',
    'titleRecommender.prompt': '스토리 제목을 추천받으시겠습니까?',
    'imageGenerator.title': '이미지 생성',
    'imageGenerator.remainingCount': '남은 생성 횟수:',
    'imageGenerator.model': '사용 모델:',
    'imageGenerator.imageGenerated': '이미지 생성됨',
    'imageGenerator.imageList': '이미지 목록 (1:1 비율)',
    'imageGenerator.textList': '스토리 텍스트 목록',
    'imageGenerator.selectCover': '표지 선택',
    'imageGenerator.regenerate': '재생성',
    'imageGenerator.selectText': '텍스트 선택',
    'imageGenerator.generating': '생성 중...',
    'imageGenerator.noImage': '이미지 없음',
    'preview.mobile': '모바일 (9:16)',
    'preview.desktop': '데스크톱 (16:9)',
    'preview.fullscreen': '전체화면',
    'preview.exit': '나가기',
    'preview.close': '닫기',
    'preview.prev': '이전',
    'preview.next': '다음',
    'preview.cover': '표지',
    'preview.story': '스토리',
    'preview.storyNumber': '스토리 #',
    'footer.education': 'Story Bringer: 크리에이터 교육 목적의 기능 제한 버전',
    'footer.techStack': '기술 스택: React, Vite, TypeScript, Tailwind CSS, OpenAI GPT API, Google Gemini API, jsPDF, html2canvas, axios, react-router-dom',
    'footer.developer': '개발자 정보: JUN / naebon@naver.com / www.nextplatform.net',
    'common.loading': '로딩 중...',
    'common.error': '오류',
    'common.success': '성공',
  },
  en: {
    'app.title': 'Story Bringer',
    'header.export': 'Export',
    'header.newStory': 'New Story',
    'header.settings': 'Settings',
    'tabs.storyEdit': 'Story Edit',
    'tabs.titleRecommend': 'Title Recommendation',
    'tabs.imageGenerate': 'Image Generation',
    'tabs.preview': 'Preview',
    'settings.theme': 'Design Theme',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.language': 'Language',
    'settings.language.ko': 'Korean',
    'settings.language.en': 'English',
    'settings.language.ja': 'Japanese',
    'storyInput.title': 'Story Input',
    'storyInput.description': 'A graphic novel creation tool utilizing the latest features of GPT and Gemini',
    'storyInput.submit': 'Generate Story',
    'storyInput.storyLine': 'Story Line',
    'storyInput.storyLine.placeholder': 'Please enter the main content of the story...',
    'storyInput.characters': 'Characters',
    'storyInput.characters.placeholder': 'Describe the main characters and their characteristics...',
    'storyInput.similarWorks': 'Similar Works',
    'storyInput.similarWorks.placeholder': 'Enter works or styles you would like to reference...',
    'storyInput.genre': 'Genre',
    'storyInput.designStyle': 'Design Style',
    'storyInput.artist': 'Artist (Optional)',
    'storyInput.artist.placeholder': 'Artist style you would like to reference...',
    'storyInput.director': 'Director (Optional)',
    'storyInput.director.placeholder': 'Director style you would like to reference...',
    'storyInput.generating': 'Generating Story...',
    'storyInput.fileUpload': 'Text File Upload (Optional)',
    'storyInput.fileUpload.dragDrop': 'Drag and drop a text file or click to upload',
    'storyInput.fileUpload.uploaded': 'File uploaded. Click to change to another file.',
    'storyInput.fileUpload.length': 'Uploaded text length:',
    'storyInput.fileUpload.error': 'Only text files (.txt) can be uploaded.',
    'storyInput.fileUpload.readError': 'An error occurred while reading the file.',
    'storyEditor.title': 'Story Edit',
    'storyEditor.imageGenerationGuide': 'Image Generation Guide',
    'storyEditor.imageGenerationGuide.placeholder': 'Enter a guide to be applied to all image generation...',
    'storyEditor.imageGenerationGuide.example': 'Example: No speech bubbles, Do not include text, etc.',
    'titleRecommender.title': 'Title Recommendation',
    'titleRecommender.generate': 'Get Title Recommendations',
    'titleRecommender.select': 'Please select one of the recommended titles:',
    'titleRecommender.edit': 'Edit Title',
    'titleRecommender.save': 'Save',
    'titleRecommender.cancel': 'Cancel',
    'titleRecommender.decide': 'Decide on This Title',
    'titleRecommender.regenerate': 'Get Other Recommendations',
    'titleRecommender.currentTitle': 'Currently Selected Title:',
    'titleRecommender.selected': 'Selected',
    'titleRecommender.editing': 'Edit Title',
    'titleRecommender.prompt': 'Would you like to get title recommendations for your story?',
    'imageGenerator.title': 'Image Generation',
    'imageGenerator.remainingCount': 'Remaining Generations:',
    'imageGenerator.model': 'Model Used:',
    'imageGenerator.imageGenerated': 'Image Generated',
    'imageGenerator.imageList': 'Image List (1:1 Ratio)',
    'imageGenerator.textList': 'Story Text List',
    'imageGenerator.selectCover': 'Select Cover',
    'imageGenerator.regenerate': 'Regenerate',
    'imageGenerator.selectText': 'Select Text',
    'imageGenerator.generating': 'Generating...',
    'imageGenerator.noImage': 'No Image',
    'preview.mobile': 'Mobile (9:16)',
    'preview.desktop': 'Desktop (16:9)',
    'preview.fullscreen': 'Fullscreen',
    'preview.exit': 'Exit',
    'preview.close': 'Close',
    'preview.prev': 'Previous',
    'preview.next': 'Next',
    'preview.cover': 'Cover',
    'preview.story': 'Story',
    'preview.storyNumber': 'Story #',
    'footer.education': 'Story Bringer: Feature-limited version for creator education purposes',
    'footer.techStack': 'Tech Stack: React, Vite, TypeScript, Tailwind CSS, OpenAI GPT API, Google Gemini API, jsPDF, html2canvas, axios, react-router-dom',
    'footer.developer': 'Developer Info: JUN / naebon@naver.com / www.nextplatform.net',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
  ja: {
    'app.title': 'Story Bringer',
    'header.export': 'エクスポート',
    'header.newStory': '新しいストーリー',
    'header.settings': '設定',
    'tabs.storyEdit': 'ストーリー編集',
    'tabs.titleRecommend': 'タイトル推薦',
    'tabs.imageGenerate': '画像生成',
    'tabs.preview': 'プレビュー',
    'settings.theme': 'デザインテーマ',
    'settings.theme.light': 'ライト',
    'settings.theme.dark': 'ダーク',
    'settings.language': '言語',
    'settings.language.ko': '韓国語',
    'settings.language.en': '英語',
    'settings.language.ja': '日本語',
    'storyInput.title': 'ストーリー入力',
    'storyInput.description': 'GPTとGeminiの最新機能を活用したグラフィックノベル作成ツール',
    'storyInput.submit': 'ストーリー生成',
    'storyInput.storyLine': 'ストーリーライン',
    'storyInput.storyLine.placeholder': 'ストーリーの主要内容を入力してください...',
    'storyInput.characters': '登場人物',
    'storyInput.characters.placeholder': '主要な登場人物とその特徴を説明してください...',
    'storyInput.similarWorks': '類似作品',
    'storyInput.similarWorks.placeholder': '参考にしたい作品やスタイルを入力してください...',
    'storyInput.genre': 'ジャンル',
    'storyInput.designStyle': 'デザインスタイル',
    'storyInput.artist': 'アーティスト (任意)',
    'storyInput.artist.placeholder': '参考にしたいアーティストスタイル...',
    'storyInput.director': 'ディレクター (任意)',
    'storyInput.director.placeholder': '参考にしたいディレクタースタイル...',
    'storyInput.generating': 'ストーリー生成中...',
    'storyInput.fileUpload': 'テキストファイルアップロード (任意)',
    'storyInput.fileUpload.dragDrop': 'テキストファイルをドラッグ&ドロップするか、クリックしてアップロードしてください',
    'storyInput.fileUpload.uploaded': 'ファイルがアップロードされました。クリックして別のファイルに変更できます。',
    'storyInput.fileUpload.length': 'アップロードされたテキストの長さ:',
    'storyInput.fileUpload.error': 'テキストファイル(.txt)のみアップロード可能です。',
    'storyInput.fileUpload.readError': 'ファイル読み込み中にエラーが発生しました。',
    'storyEditor.title': 'ストーリー編集',
    'storyEditor.imageGenerationGuide': '画像生成ガイド',
    'storyEditor.imageGenerationGuide.placeholder': 'すべての画像生成に適用するガイドを入力してください...',
    'storyEditor.imageGenerationGuide.example': '例: 吹き出しを作成しない、テキストを含めないなど',
    'titleRecommender.title': 'タイトル推薦',
    'titleRecommender.generate': 'タイトル推薦を受ける',
    'titleRecommender.select': '推奨タイトルから1つ選択してください:',
    'titleRecommender.edit': 'タイトル編集',
    'titleRecommender.save': '保存',
    'titleRecommender.cancel': 'キャンセル',
    'titleRecommender.decide': 'このタイトルで決定',
    'titleRecommender.regenerate': '他の推薦を受ける',
    'titleRecommender.currentTitle': '現在選択されているタイトル:',
    'titleRecommender.selected': '選択済み',
    'titleRecommender.editing': 'タイトル編集',
    'titleRecommender.prompt': 'ストーリーのタイトル推薦を受けますか？',
    'imageGenerator.title': '画像生成',
    'imageGenerator.remainingCount': '残り生成回数:',
    'imageGenerator.model': '使用モデル:',
    'imageGenerator.imageGenerated': '画像生成済み',
    'imageGenerator.imageList': '画像リスト (1:1比率)',
    'imageGenerator.textList': 'ストーリーテキストリスト',
    'imageGenerator.selectCover': '表紙選択',
    'imageGenerator.regenerate': '再生成',
    'imageGenerator.selectText': 'テキスト選択',
    'imageGenerator.generating': '生成中...',
    'imageGenerator.noImage': '画像なし',
    'preview.mobile': 'モバイル (9:16)',
    'preview.desktop': 'デスクトップ (16:9)',
    'preview.fullscreen': '全画面',
    'preview.exit': '終了',
    'preview.close': '閉じる',
    'preview.prev': '前へ',
    'preview.next': '次へ',
    'preview.cover': '表紙',
    'preview.story': 'ストーリー',
    'preview.storyNumber': 'ストーリー #',
    'footer.education': 'Story Bringer: クリエイター教育目的の機能制限版',
    'footer.techStack': '技術スタック: React, Vite, TypeScript, Tailwind CSS, OpenAI GPT API, Google Gemini API, jsPDF, html2canvas, axios, react-router-dom',
    'footer.developer': '開発者情報: JUN / naebon@naver.com / www.nextplatform.net',
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.success': '成功',
  },
};

export function t(key: TranslationKey, language: Language): string {
  return translations[language]?.[key] || key;
}

export function getStoryPrompt(language: Language): string {
  const prompts = {
    ko: `당신은 전문 그래픽 노블 작가입니다. 다음 정보를 바탕으로 3분 읽기 분량의 그래픽 노블 스토리를 작성해주세요.

요구사항:
1. 스토리는 반드시 6-8개의 챕터로 구성되어야 합니다.
2. 각 챕터는 간결하고 명확해야 합니다.
3. 각 챕터는 이미지와 함께 표현될 수 있도록 시각적으로 묘사되어야 합니다.
4. 챕터는 반드시 다음과 같은 정확한 형식으로 작성해주세요 (대소문자 구분):
   [CHAPTER: 첫 번째 챕터 제목]
   첫 번째 챕터 내용...
   
   [CHAPTER: 두 번째 챕터 제목]
   두 번째 챕터 내용...
   
   [CHAPTER: 세 번째 챕터 제목]
   세 번째 챕터 내용...
   
   (이하 동일한 형식으로 계속)

중요: 각 챕터는 반드시 [CHAPTER: 제목] 형식으로 시작하고, 챕터 사이에는 빈 줄을 넣어주세요.`,
    en: `You are a professional graphic novel writer. Based on the following information, please write a graphic novel story that takes about 3 minutes to read.

Requirements:
1. The story MUST consist of 6-8 chapters.
2. Each chapter should be concise and clear.
3. Each chapter should be visually described so that it can be expressed with images.
4. Please write chapters in the following EXACT format (case-sensitive):
   [CHAPTER: First Chapter Title]
   First chapter content...
   
   [CHAPTER: Second Chapter Title]
   Second chapter content...
   
   [CHAPTER: Third Chapter Title]
   Third chapter content...
   
   (Continue in the same format)

IMPORTANT: Each chapter MUST start with [CHAPTER: Title] format, and add a blank line between chapters.`,
    ja: `あなたはプロのグラフィックノベル作家です。以下の情報に基づいて、約3分で読めるグラフィックノベルストーリーを作成してください。

要件:
1. ストーリーは必ず6-8章で構成される必要があります。
2. 各章は簡潔で明確である必要があります。
3. 各章は画像と共に表現できるよう視覚的に描写する必要があります。
4. 以下の正確な形式で章を記述してください（大文字小文字を区別）:
   [CHAPTER: 最初の章のタイトル]
   最初の章の内容...
   
   [CHAPTER: 2番目の章のタイトル]
   2番目の章の内容...
   
   [CHAPTER: 3番目の章のタイトル]
   3番目の章の内容...
   
   (同じ形式で続ける)

重要: 各章は必ず[CHAPTER: タイトル]形式で始まり、章の間に空行を入れてください。`,
  };
  return prompts[language];
}

export function getTitlePrompt(language: Language): string {
  const prompts = {
    ko: `다음 그래픽 노블 스토리의 내용을 바탕으로 매력적인 제목 최대 6개를 추천해주세요.

요구사항:
1. 각 제목은 한 줄로 작성해주세요.
2. 제목은 번호 없이 제목만 작성해주세요.
3. 최대 6개의 제목을 줄바꿈으로 구분해주세요.`,
    en: `Based on the following graphic novel story, please recommend up to 6 attractive titles.

Requirements:
1. Each title should be written in one line.
2. Write only the title without numbers.
3. Separate up to 6 titles with line breaks.`,
    ja: `以下のグラフィックノベルストーリーの内容に基づいて、魅力的なタイトルを最大6個推薦してください。

要件:
1. 各タイトルは1行で記述してください。
2. 番号なしでタイトルのみ記述してください。
3. 最大6個のタイトルを改行で区切ってください。`,
  };
  return prompts[language];
}

