
// Define the available languages
export type Language = 'en' | 'fr';

// Translation dictionary type
export type TranslationDictionary = Record<string, string>;

// Context type definition
export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  addTranslation: (lang: Language, key: string, value: string) => void;
  updateTranslation: (lang: Language, key: string, value: string) => void;
  getAllTranslations: () => Record<string, Record<string, string>>;
}
