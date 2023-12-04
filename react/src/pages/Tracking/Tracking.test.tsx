import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { Tracking } from './Tracking';
import { setDataFieldWithID } from 'slices/dataSlice';

const mockNavigate = jest.fn();
const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
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

jest.mock('@capacitor-community/fcm', () => {});

const mockSchedule = jest.fn();
const mockGetPending = jest.fn();
const mockCancel = jest.fn();

jest.mock('@capacitor/local-notifications', () => ({
  LocalNotifications: {
    schedule: (data: any) => mockSchedule(data),
    getPending: () => mockGetPending(),
    cancel: (data: any) => mockCancel(data)
  }
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useNavigate: () => jest.fn()
}));

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => mockAuth
}));

jest.mock('@capacitor/core', () => ({
  ...jest.requireActual('@capacitor/core'),
  Capacitor: {
    getPlatform: jest.fn().mockReturnValue('ios')
  }
}));

jest.mock('helpers/ios/healthKit', () => ({
  init: jest.fn().mockReturnThis()
}));

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () =>
        Promise.resolve({
          items: [{ fields: { title: 'test habit', pillar: 'exercise' } }]
        })
    };
  }
}));

jest.mock('storybook-dark-mode', () => ({
  useDarkMode: jest.fn()
}));

describe('Tracking page tests', () => {
  beforeAll(() => {
    store.dispatch(setDataFieldWithID({ id: 'onboardingDone', value: true }));
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
  });

  test('Renders tracking page', () => {
    render(
      <Provider store={store}>
        <Tracking />
      </Provider>
    );

    const text = screen.getByText(/Progress/i);
    expect(text).toBeInTheDocument();
  });
});
