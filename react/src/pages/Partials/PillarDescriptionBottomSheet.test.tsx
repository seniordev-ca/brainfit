import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'store/store';
import { PillarDescriptionBottomSheet } from './PillarDescriptionBottomSheet';

import NetworkHelper from 'helpers/web/networkHelper';

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
      getEntry: () =>
        Promise.resolve({
          sys: {
            id: 'Pillar ID'
          },
          fields: {
            title: 'Exercise',
            description: 'Something'
          }
        }),
      getEntries: () =>
        Promise.resolve({
          items: [
            {
              sys: {
                id: 'ID 1'
              },
              fields: {
                title: 'Exercise',
                description: 'Exercise'
              }
            },
            {
              sys: {
                id: 'ID 2'
              },
              fields: {
                title: 'Sleep',
                description: 'Sleep'
              }
            }
          ]
        })
    };
  }
}));

describe('PillarDescriptionBottomSheet tests', () => {
  test('Renders PillarDescriptionBottomSheet', async () => {
    const setOpen = jest.fn();
    NetworkHelper.trackActivity = jest.fn().mockResolvedValue(true);
    render(
      <Provider store={store}>
        <BrowserRouter>
          <PillarDescriptionBottomSheet open={true} setOpen={setOpen} />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const text = screen.getByText(/Exercise/i);
      expect(text).toBeInTheDocument();
    });
  });
});
