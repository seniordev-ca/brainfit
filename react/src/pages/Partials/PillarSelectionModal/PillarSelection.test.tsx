import store from 'store/store';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { PillarSelectionModal } from './PillarSelectionModal';

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

describe('Pillar Selection Modal tests', () => {
  test('Renders Pillar selection modal', () => {
    const setOpen = jest.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <PillarSelectionModal  open={true} setOpen={setOpen} />
        </BrowserRouter>
      </Provider>
    );

    const pillarText = screen.getAllByText('Select Pillar');
    expect(pillarText[0]).toBeInTheDocument();
  })
})