import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import 'dayjs/locale/vi';
import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';

import { STORAGE_KEY } from '@/utils/constants';
import storage from '@/utils/storage';

import { defaultNS, resources } from './resources';

export const SUPPORTED_LANGUAGES = ['vi', 'en', 'ja'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = 'en';

const getInitialLanguage = (): Language => {
  // 1. Check storage
  const stored = storage.get<string>(STORAGE_KEY.LANGUAGE);
  if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
    return stored as Language;
  }

  // 2. Check browser language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.split('-')[0];
    if ((SUPPORTED_LANGUAGES as readonly string[]).includes(browserLang)) {
      return browserLang as Language;
    }
  }

  // 3. Fallback
  return DEFAULT_LANGUAGE;
};

const initialLanguage = getInitialLanguage();

function applyLanguage(lng: string): void {
  document.documentElement.setAttribute('data-lang', lng);
  dayjs.locale(lng);
}

i18n.use(initReactI18next).init({
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [...SUPPORTED_LANGUAGES],
  defaultNS,
  ns: Object.keys(resources.en),
  resources,
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  storage.set(STORAGE_KEY.LANGUAGE, lng);
  applyLanguage(lng);
});

applyLanguage(initialLanguage);

export default i18n;
