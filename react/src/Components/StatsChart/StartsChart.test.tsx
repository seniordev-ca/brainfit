import { render, screen } from '@testing-library/react';
import { StatsChart } from './StatsChart';

jest.mock('storybook-dark-mode', () => ({
  useDarkMode: jest.fn()
}));

describe('StatsChart tests', () => {
  beforeAll(() => {
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    });

    global.ResizeObserver = require('resize-observer-polyfill');
  });

  test('renders StatsChart with no data', () => {
    render(<StatsChart labels={[]} values={[]} />);
    const label = screen.getByTestId('statsChart');
    expect(label).toBeVisible();
  });

  test('renders StatsChart with data', () => {
    render(<StatsChart labels={['Mo', 'We', 'Fr']} values={[0, 100, 50]} />);

    const label = screen.getByTestId('statsChart');

    expect(label).toBeVisible();
  });
});
