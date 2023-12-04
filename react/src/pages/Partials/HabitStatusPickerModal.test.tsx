import { render, screen } from '@testing-library/react';
import { EmptyHabit } from 'contexts/customhabit.context';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'store/store';
import { HabitStatusPickerModal } from './HabitStatusPickerModal';

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

describe('Habit Status Picker Modal Modal tests', () => {
  test('Renders habit status picker', async () => {
    const setOpen = jest.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <HabitStatusPickerModal
            habit={EmptyHabit}
            onStatusSelected={() => {}}
            setOpen={setOpen}
            open={true}
          />
        </BrowserRouter>
      </Provider>
    );

    const custom = screen.getByText(/Set status/i);
    expect(custom).toBeInTheDocument();
  });
});
