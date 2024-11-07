import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import HOME_vi from '../locales/vi/home.json'
import HOME_EN from '../locales/en/home.json'
export const locales = {
  en: 'English',
  vi: 'Tiếng Việt',
} as const

export const resources = {
  en: {
    home: HOME_EN,
  },
  vi: {
    home: HOME_vi,
  },
} as const
export const defaultNS = 'home'
i18next.use(initReactI18next).init({
  resources,
  lng: 'vi',
  ns: ['home', 'info'],
  fallbackLng: 'vi',
  defaultNS,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
})
