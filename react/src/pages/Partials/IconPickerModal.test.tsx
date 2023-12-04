import { render, screen, waitFor } from '@testing-library/react';
import {
  BasicHabitContextProps,
  CustomHabitContext
} from 'contexts/customhabit.context';
import { Habit } from 'models/habit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'store/store';
import { IconPickerModal } from './IconPickerModal';

jest.mock('@capacitor-community/fcm', () => {});

const iconList = [
  'eva:alert-circle-fill',
  'eva:bulb-outline',
  'eva:camera-fill',
  'eva:checkmark-circle-2-outline',
  'eva:clock-outline',
  'eva:close-square-outline',
  'eva:cloud-download-outline',
  'eva:color-palette-outline',
  'eva:compass-outline',
  'eva:eye-fill'
];

jest.mock('@iconify/react', () => ({
  ...jest.requireActual('@iconify/react'),
  listIcons: () => iconList
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

describe('Icon Modal tests', () => {
  test('Renders icon picker', async () => {
    const setOpen = jest.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CustomHabitContext.Provider
            value={{
              ...BasicHabitContextProps,
              habit: Habit.create({
                ...BasicHabitContextProps.habit,
                icon: 'eva:bulb-outline'
              })
            }}
          >
            <IconPickerModal setOpen={setOpen} open={true} />
          </CustomHabitContext.Provider>
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('iconListTestID')).toBeInTheDocument();
    });
  });

  test('Renders emoji screen', async () => {
    const setOpen = jest.fn();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CustomHabitContext.Provider
            value={{
              ...BasicHabitContextProps,
              habit: Habit.create({
                ...BasicHabitContextProps.habit,
                icon: 'black 🌊'
              })
            }}
          >
            <IconPickerModal setOpen={setOpen} open={true} />
          </CustomHabitContext.Provider>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('emoji')).toBeInTheDocument();
  });
});
