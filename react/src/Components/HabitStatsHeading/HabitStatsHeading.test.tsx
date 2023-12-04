import { render, screen } from '@testing-library/react';
import { HabitStatsHeading } from './HabitStatsHeading';
jest.mock('storybook-dark-mode', () => ({
  useDarkMode: jest.fn()
}))


describe('HabitStatsHeading tests', () => {
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
  test('Renders HabitStatsHeading', async () => {
    render(
      <HabitStatsHeading
        habitColour="brown"
        habitIcon={'🌊'}
        habitName={'Habit'}
        habitPillar={'Exercise'}
        habitStatus={'8 waves'}
      />
    );

    const custom = screen.getByTestId('progressIcon');
    expect(custom).toBeInTheDocument();
  });
});
