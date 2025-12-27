import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Theme = 'light' | 'dark';
export type Language = 'ko' | 'en' | 'ja';

interface AppContextType {
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * 사용자의 브라우저 언어 설정을 기반으로 기본 언어를 결정합니다.
 * 한국 → 한국어, 일본 → 일본어, 그 외 → 영어
 */
function getDefaultLanguage(): Language {
  // localStorage에 저장된 언어가 있으면 우선 사용
  const saved = localStorage.getItem('app-language');
  if (saved && (saved === 'ko' || saved === 'en' || saved === 'ja')) {
    return saved as Language;
  }

  // 브라우저 언어 설정 확인
  if (typeof window !== 'undefined' && navigator.language) {
    const browserLang = navigator.language.toLowerCase();
    
    // 한국어 확인 (ko, ko-KR 등)
    if (browserLang.startsWith('ko')) {
      return 'ko';
    }
    
    // 일본어 확인 (ja, ja-JP 등)
    if (browserLang.startsWith('ja')) {
      return 'ja';
    }
  }

  // 기본값: 영어
  return 'en';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved as Theme) || 'light';
  });
  
  const [language, setLanguageState] = useState<Language>(() => {
    return getDefaultLanguage();
  });

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app-language', language);
  }, [language]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  return (
    <AppContext.Provider value={{ theme, language, setTheme, setLanguage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

