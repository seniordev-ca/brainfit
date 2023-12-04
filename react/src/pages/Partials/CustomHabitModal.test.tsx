import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { setHabitFieldWithID } from 'slices/habitSlice';
import store from 'store/store';
import { CustomHabitModal } from './CustomHabitModal';

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

describe('Custom Habit Modal tests', () => {
  beforeAll(() => {
    store.dispatch(setHabitFieldWithID({ id: 'customHabitOpen', value: true }));
  });

  test('Renders custom habit modal', async () => {
    const setOpen = jest.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <CustomHabitModal open={true} setOpen={setOpen} />
        </BrowserRouter>
      </Provider>
    );

    const custom = screen.getAllByText(/Add habit/i);
    expect(custom[0]).toBeInTheDocument();
  });

  // test('Renders icon', async () => {
  //   const setOpen = jest.fn();

  //   render(
  //     <Provider store={store}>
  //       <BrowserRouter>
  //         <CustomHabitModal open={true} setOpen={setOpen} />
  //       </BrowserRouter>
  //     </Provider>
  //   );
  //   expect(screen.getByTestId(selectedColour)).toBeInTheDocument();
  // });
});
