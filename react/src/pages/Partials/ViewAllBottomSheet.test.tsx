import { render, screen } from '@testing-library/react';
import NetworkHelper from 'helpers/web/networkHelper';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { setDataFieldWithID } from 'slices/dataSlice';
import { setHabitFieldWithID } from 'slices/habitSlice';
import store from 'store/store';
import { ViewAllBottomSheet } from './ViewAllBottomSheet';

jest.mock('@capacitor-community/fcm', () => {});

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

const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => mockAuth
}));

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () =>
        Promise.resolve({
          items: [
            {
              sys: {
                id: 'workoutID'
              },
              fields: {
                pillar: 'exercise',
                title: 'workout',
                defaultIcon: 'fa-solid:running',
                weekly: false
              }
            }
          ]
        })
    };
  }
}));

describe('View All Habit Modal tests', () => {
  beforeAll(() => {
    store.dispatch(setHabitFieldWithID({ id: 'newHabitOpen', value: true }));
  });

  test('Renders view all habit modal', async () => {
    const setOpen = jest.fn();
    NetworkHelper.trackActivity = jest.fn().mockResolvedValue(true);
    await store.dispatch(
      setDataFieldWithID({ id: 'newHabitOpen', value: true })
    );
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ViewAllBottomSheet open={true} setOpen={setOpen} />
        </BrowserRouter>
      </Provider>
    );

    const custom = screen.getByText(/Back/i);
    expect(custom).toBeInTheDocument();
  });
});
