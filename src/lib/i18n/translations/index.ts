
import enTranslations from './en';
import frTranslations from './fr';
import { Language, TranslationDictionary } from '../types';

// Combined translations object
const translations: Record<Language, TranslationDictionary> = {
  en: enTranslations,
  fr: frTranslations
};

export default translations;
