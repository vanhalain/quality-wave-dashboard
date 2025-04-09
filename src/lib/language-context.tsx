
import React, { createContext, useContext, useState } from 'react';
import { Language, LanguageContextType } from './i18n/types';
import translations from './i18n/translations';

// Default context value
const defaultValue: LanguageContextType = {
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
  addTranslation: () => {},
  updateTranslation: () => {},
  getAllTranslations: () => ({ en: {}, fr: {} }),
};

// Create the language context
const LanguageContext = createContext<LanguageContextType>(defaultValue);

export interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Get initial language from localStorage or default to French
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('appLanguage') as Language;
    return (savedLanguage && (savedLanguage === 'fr' || savedLanguage === 'en')) ? savedLanguage : 'fr';
  });

  // State to store translations
  const [translationsState, setTranslationsState] = useState(translations);

  // Translation function
  const t = (key: string): string => {
    return translationsState[language][key] || key;
  };

  // Update language and save to localStorage
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('appLanguage', newLanguage);
  };

  // Add a new translation
  const addTranslation = (lang: Language, key: string, value: string) => {
    setTranslationsState(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value
      }
    }));
  };

  // Update an existing translation
  const updateTranslation = (lang: Language, key: string, value: string) => {
    setTranslationsState(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [key]: value
      }
    }));
  };

  // Get all translations
  const getAllTranslations = () => {
    return translationsState;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      addTranslation, 
      updateTranslation, 
      getAllTranslations 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Re-export types
export type { Language } from './i18n/types';
