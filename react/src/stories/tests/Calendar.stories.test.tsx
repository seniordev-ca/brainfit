// Calendar.stories.test.tsx

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Calendar.stories';
import moment from 'moment';

const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => mockAuth
}));

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: () => ({
      data: {
        email: '',
        password: ''
      }
    })
  };
});

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

const {
  DefaultCalendar,
  MonthlyView,
  MonthlyViewNoNavigationAndHeader,
  MultipleDaysSelection,
  ShowWeekdaysInsteadOfDates,
  PassDatesWithDifferentStyling,
  ShowWeekdaysHideHeader
} = composeStories(stories);

const mockNow = moment();
jest.mock('react', () => {
  const ActualReact = jest.requireActual('react');
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
  };
});

it('renders the default Calendar', async () => {
  render(<DefaultCalendar {...DefaultCalendar.args} />);

  await waitFor(() => {
    const text = screen.getByText(/previous/i);
    expect(text).toBeInTheDocument();
  });
});

it('renders the monthly view Calendar', async () => {
  render(<MonthlyView {...MonthlyView.args} />);

  await waitFor(() => {
    const text = screen.getByText(/previous/i);
    expect(text).toBeInTheDocument();
  });
});

it('renders the monthly view Calendar without header and navigation', async () => {
  render(
    <MonthlyViewNoNavigationAndHeader
      {...MonthlyViewNoNavigationAndHeader.args}
    />
  );

  await waitFor(() => {
    const text = screen.getByText('12');
    expect(text).toBeInTheDocument();
  });
});

it('renders the days selection Calendar', async () => {
  render(<MultipleDaysSelection {...MultipleDaysSelection.args} />);

  await waitFor(() => {
    const text = screen.getByText(/W/i);
    expect(text).toBeInTheDocument();
  });
});

it('renders the calendar with weekdays', async () => {
  render(<ShowWeekdaysInsteadOfDates {...ShowWeekdaysInsteadOfDates.args} />);

  await waitFor(() => {
    const text = screen.getByText(/previous/i);
    expect(text).toBeInTheDocument();
  });
});

it('renders the different styling calendar', async () => {
  render(
    <PassDatesWithDifferentStyling {...PassDatesWithDifferentStyling.args} />
  );

  await waitFor(() => {
    const text = screen.getByText(/previous/i);
    expect(text).toBeInTheDocument();
  });
});

it('renders the calendar without the header', async () => {
  render(<ShowWeekdaysHideHeader {...ShowWeekdaysHideHeader.args} />);

  await waitFor(() => {
    const text = screen.getByText(/previous/i);
    expect(text).toBeInTheDocument();
  });
});
