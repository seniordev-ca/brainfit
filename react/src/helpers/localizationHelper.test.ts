import localization from './localizationHelper'

describe('Localization Helper Unit Tests', () => {
  test('returns default English string', async () => {
    expect(localization.getString("titleString")).toEqual('Welcome to BrainFit')
  })

  test('returns French string after language change', async () => {
    localization.setLanguage("fr")
    expect(localization.getString("titleString")).toEqual('Bienvenue dans BrainFit')
  })
})