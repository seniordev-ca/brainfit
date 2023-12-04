import { render, screen, waitFor } from '@testing-library/react';
import { EmptyHabit } from 'contexts/customhabit.context';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'store/store';
import { HabitDetailsBottomSheet } from './HabitDetailsBottomSheet';

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
const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => mockAuth
}));

jest.mock('@capacitor-community/fcm', () => { });

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

// jest.mock('helpers/stateHelper', () => ({
//   useUserHabitsComplete: () => ({
//     habits: [
//       {
//         id: 'test-habit-id',
//         pillars: ['Exercise'],
//         title: 'Habit Test',
//         units: 'cm',
//         breakHabit: false,
//         cmsLink: '',
//         dailyDigest: true,
//         description: '',

//         frequencyUnit: 'day',
//         frequencyDays: [0, 1, 2, 3, 4, 5, 6],
//         frequencyUnitQuantity: 1,

//         frequencySpecificDay: -1,
//         frequencySpecificDate: 0,

//         startDate: Date.now(),
//         endDate: Date.now() + 3.156e11,

//         icon: '',
//         remindMe: true,
//         reminders: [],
//         targetValue: 100,
//         status: 'active',
//         colour: 'red',

//         progress: 0,
//         completionStats: {
//           averageCompletion: 0,
//           currentStreak: 0,
//           longestStreak: 0,
//           totalCompleted: 0
//         },
//         activities: []
//       }
//     ]
//   })
// }));

jest.mock('@capacitor/push-notifications', () => ({
  PushNotifications: {
    addListener: () => jest.fn(),
    checkPermissions: () => jest.fn(),
    requestPermissions: () => jest.fn(),
    register: () => jest.fn(),
    getDeliveredNotifications: () => jest.fn()
  }
}));

describe('Habit Details Bottom Sheet tests', () => {
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
  test('Renders habit details bottom sheet', async () => {
    const setOpen = jest.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          {/* <StateHelperContextProvider> */}
          <HabitDetailsBottomSheet
            open={true}
            setOpen={setOpen}
            habitSelected={EmptyHabit}
          />
          {/* </StateHelperContextProvider> */}
        </BrowserRouter>
      </Provider>
    );
    await waitFor(() => {
      const custom = screen.getByText(/History/i);
      expect(custom).toBeInTheDocument();
    });
  });
});
