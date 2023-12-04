import { provinceOptions, countryOptions } from './options'
describe('Options unit tests', () => {
  test('Province options', () => {
    expect(provinceOptions.length).toEqual(13)
  })

  test('Country options', () => {
    expect(countryOptions.length).toEqual(2)
  })
})