import englishStrings from './languages/en'
import frenchStrings from './languages/fr'

const strings: { [key: string]: { [key: string]: string } } = {
  'en': englishStrings,
  'fr': frenchStrings
}

let languageKey: string = 'en'

const localization = {
  getString: (key: string) => {
    const currentLanguage: { [key: string]: string } = strings[languageKey]
    return currentLanguage[key]
  },

  setLanguage: (key: string) => {
    languageKey = key
  }
}

export default localization
