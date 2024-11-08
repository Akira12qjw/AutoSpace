import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import HOME_vi from '../locales/vi/home.json'
import HOME_EN from '../locales/en/home.json'
import LOGIN_EN from '../locales/en/login.json'
import LOGIN_VI from '../locales/vi/login.json'
import REGISTER_EN from '../locales/en/register.json'
import REGISTER_VI from '../locales/vi/register.json'
import GARAGE_EN from '../locales/en/gara.json'
import GARAGE_VI from '../locales/vi/gara.json'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt',
} as const

export const resources = {
  en: {
    home: HOME_EN,
    login: LOGIN_EN,
    register: REGISTER_EN,
    garage: GARAGE_EN,
  },
  vi: {
    home: HOME_vi,
    login: LOGIN_VI,
    register: REGISTER_VI,
    garage: GARAGE_VI,
  },
} as const
export const defaultNS = 'home'
i18next.use(initReactI18next).init({
  resources,
  lng: 'vi',
  ns: ['home', 'info', 'login', 'register', 'garage'],
  fallbackLng: 'vi',
  defaultNS,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
})
