import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'store/store';
import { HabitCompletionBottomSheet } from './HabitCompletionBottomSheet';

import { EmptyHabit } from 'contexts/customhabit.context';
import NetworkHelper from 'helpers/web/networkHelper';
import moment from 'moment';

jest.mock('@capacitor-community/fcm', () => {});

const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => mockAuth
}));

jest.mock('@capacitor/push-notifications', () => ({
  PushNotifications: {
    addListener: () => jest.fn(),
    checkPermissions: () => jest.fn(),
    requestPermissions: () => jest.fn(),
    register: () => jest.fn(),
    getDeliveredNotifications: () => jest.fn()
  }
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () =>
        Promise.resolve({
          items: [
            {
              sys: {
                id: 'Pillar ID'
              },
              fields: {
                pillar: 'general',
                title: 'Test content'
              }
            }
          ]
        })
    };
  }
}));

describe('Habit completion tests', () => {
  test('Renders habit completion bottom sheet', async () => {
    const setOpen = jest.fn();
    const setHabitDetailsOpen = jest.fn();
    NetworkHelper.trackActivity = jest.fn().mockResolvedValue(true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <HabitCompletionBottomSheet
            habitSelected={EmptyHabit}
            open={true}
            setOpen={setOpen}
            selectedDate={moment()}
            setHabitDetailsOpen={setHabitDetailsOpen}
          />
        </BrowserRouter>
      </Provider>
    );

    const custom = screen.getByText(/Progress/i);
    expect(custom).toBeInTheDocument();
  });

  // test('Renders checkmark', async () => {
  //   const setOpen = jest.fn();
  //   const setHabitDetailsOpen = jest.fn();
  //   NetworkHelper.trackActivity = jest.fn().mockResolvedValue(true);
  //   render(
  //     <Provider store={store}>
  //       <BrowserRouter>
  //         <HabitCompletionBottomSheet
  //           habitSelected={EmptyHabit}
  //           open={true}
  //           setOpen={setOpen}
  //           selectedDate={moment()}
  //           setHabitDetailsOpen={setHabitDetailsOpen}
  //         />
  //       </BrowserRouter>
  //     </Provider>
  //   );

  //   expect(screen.getByTestId('checkmark')).toBeInTheDocument();
  // });
});
