import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'store/store';
import { TipsModal } from './TipsModal';

jest.mock('@capacitor-community/fcm', () => {

})

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
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () => Promise.resolve({
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
    }
  }
}));

describe('Tips modal tests', () => {
  test('Renders Tips Modal', () => {
    const setOpen = jest.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <TipsModal  open={true} setOpen={setOpen} />
        </BrowserRouter>
      </Provider>
    );

    const tipsText = screen.getByText('Tips');
    expect(tipsText).toBeInTheDocument();
  })
})