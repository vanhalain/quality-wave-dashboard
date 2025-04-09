
// Define the available languages
export type Language = 'en' | 'fr';

// Export the translation dictionary type
export type TranslationDictionary = Record<string, string>;

// Export the type for a complete set of translations
export type TranslationType = Record<string, string>;

// Context type definition
export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  addTranslation: (lang: Language, key: string, value: string) => void;
  updateTranslation: (lang: Language, key: string, value: string) => void;
  getAllTranslations: () => Record<string, Record<string, string>>;
}
