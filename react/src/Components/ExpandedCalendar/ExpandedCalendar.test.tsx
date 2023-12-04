import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { ExpandedCalendar } from './ExpandedCalendar';

jest.mock('helpers/stateHelper', () => {
  return {
    ...jest.requireActual('helpers/stateHelper'),
    useUserHabits: () => {
      return {
        habits: []
      }
    }
  }
})

test('renders Calendar', async () => {
  render(<Provider store={store}><ExpandedCalendar showCalendar={true} currentMonth={1} /></Provider>);

  await waitFor(() => {
    const text = screen.getByText(/January/i);
    expect(text).toBeInTheDocument();
  })
});