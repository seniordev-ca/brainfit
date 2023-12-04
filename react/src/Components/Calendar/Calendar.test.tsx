import { render, screen, waitFor } from '@testing-library/react';
import moment from 'moment';
import { Provider } from 'react-redux';
import store from 'store/store';
import { Calendar } from './Calendar';


const mockNow = moment();
jest.mock('react', () => {
  const ActualReact = jest.requireActual('react')
  return {
    ...ActualReact,
    useContext: () => ({
      dates: {
        dates: {
          start: mockNow,
          end: mockNow,
          selected: mockNow
        },
        setDates: jest.fn()
      }
    })
  }
})

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

test('renders Calendar', () => {
  render(<Provider store={store}><Calendar /></Provider>);
  const text = screen.getByText(/previous/i);
  expect(text).toBeInTheDocument();
});

test('renders Calendar displaying weeks range type', async () => {
  render(<Provider store={store}><Calendar /></Provider>);

  await waitFor(() => {
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toEqual(10);
  });
});


test('renders calendar in days selection mode', async () => {
  const onDaySelected = jest.fn();
  render(<Provider store={store}><Calendar calendarStyle='daysSelection' onSelectedDaysChanged={onDaySelected} /></Provider>);

  const button = screen.getByText('F');
  expect(button).toBeVisible();
});