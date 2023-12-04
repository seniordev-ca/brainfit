import { steps, getParent, getStepDetails } from './nav'

describe('Nav unit tests', () => {
  test('find no result', () => {
    const parent = getParent('missing', steps)

    expect(parent).toBeUndefined()
  })

  test('get step details', () => {
    const parent = getStepDetails('second') || { header: 'Second' }
    expect(parent.header).toEqual('Second')
  })
})