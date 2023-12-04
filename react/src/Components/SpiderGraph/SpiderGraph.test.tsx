import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { SpiderGraph } from './SpiderGraph';

const data = {
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 3,
  'six': 2
}

jest.mock('storybook-dark-mode', () => ({
  useDarkMode: jest.fn()
}))

global.ResizeObserver = require('resize-observer-polyfill')

describe('SpiderGraph tests', () => {
  beforeAll(() => {
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })
  });

  test('renders SpiderGraph with no data', () => {
    render(<Provider store={store}><SpiderGraph results={{}} /></Provider>);
    const label = screen.getByRole('img')
    expect(label).toBeVisible()
  });

  test('renders SpiderGraph with data', () => {
    render(<Provider store={store}><SpiderGraph results={data} /></Provider>);
    const label = screen.getByRole('img')
    expect(label).toBeVisible()
  });
})
