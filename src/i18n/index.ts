import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import i18n from 'i18next';

import { initReactI18next } from 'react-i18next';

import { STORAGE_KEY } from '@/utils/constants';
import storage from '@/utils/storage';

import { defaultNS, resources } from './resources';

export const SUPPORTED_LANGUAGES = ['vi', 'en'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = 'vi';

const stored = storage.get<string>(STORAGE_KEY.LANGUAGE);
const initialLanguage: Language = (
  SUPPORTED_LANGUAGES as readonly string[]
).includes(stored ?? '')
  ? (stored as Language)
  : DEFAULT_LANGUAGE;

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
