import store from 'store/store';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { HabitCollectionsModal } from './HabitCollectionsModal';

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

describe('Habit Collection Modal Tests', () => {
  test('Renders Habit Collection modal', () => {
    const setOpen = jest.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <HabitCollectionsModal open={true} setOpen={setOpen}/>
        </BrowserRouter>
      </Provider>
    )

    const buttonText = screen.getByText('Add them all');
    expect(buttonText).toBeInTheDocument();
  })
})