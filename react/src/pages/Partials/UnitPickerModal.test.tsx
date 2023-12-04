import { UnitPickerModal } from './UnitPickerModal';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { BrowserRouter } from 'react-router-dom';
import {
  BasicHabitContextProps,
  CustomHabitContext
} from 'contexts/customhabit.context';
import { Habit } from 'models/habit';

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

describe('Unit Picker Modal tests', () => {
  test('Renders unit picker', async () => {
    const setOpen = jest.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <UnitPickerModal setOpen={setOpen} open={true} />
        </BrowserRouter>
      </Provider>
    );

    const custom = screen.getByText(/Units/i);
    expect(custom).toBeInTheDocument();
  });

  test('Renders text bar', async () => {
    const setOpen = jest.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <CustomHabitContext.Provider
            value={{
              ...BasicHabitContextProps,
              habit: Habit.create({
                ...BasicHabitContextProps.habit,
                units: 'Test Units'
              })
            }}
          >
            <UnitPickerModal setOpen={setOpen} open={true} />
          </CustomHabitContext.Provider>
        </BrowserRouter>
      </Provider>
    );

    const textBar = screen.getByTestId('textbar');
    expect(textBar).toBeInTheDocument();
  });
});
