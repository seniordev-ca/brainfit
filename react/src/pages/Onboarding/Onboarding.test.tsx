import { render, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { Onboarding } from './Onboarding';

const mockNavigate = jest.fn();

jest.mock('storybook-dark-mode', () => ({
  useDarkMode: jest.fn()
}))

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

jest.mock('@capacitor/core', () => ({
  ...jest.requireActual('@capacitor/core'),
  Capacitor: {
    getPlatform: jest.fn().mockReturnValue('ios')
  }
}))

jest.mock('@capacitor/push-notifications', () => ({
  Capacitor: {
    registerPlugin: jest.fn()
  },
  PushNotifications: {
    checkPermissions: () => Promise.resolve({
      receive: 'granted'
    }),
    requestPermissions: jest.fn(),
    register: jest.fn()
  }
}))

jest.mock('helpers/ios/healthKit', () => ({
  init: jest.fn().mockReturnThis()
}));

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () => Promise.resolve({
        items: [
          {
            sys: {
              id: 'Onboarding ID'
            },
            fields: {
              title: 'Test Onboarding',
              order: 1
            }
          }
        ]
      })
    }
  }
}));

describe('Onboarding page tests', () => {
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
  test('renders onboarding page', async () => {
    render(
      <Provider store={store}>
        <Onboarding />
      </Provider>
    );
    await waitFor(() => {
      const text = screen.getByText("Sign in")
      expect(text).toBeInTheDocument()
    })
  });
})