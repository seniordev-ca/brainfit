import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  BasicHabitContextProps,
  CustomHabitContext
} from 'contexts/customhabit.context';
import PlatformHelper from 'helpers/platformHelper';
import NetworkHelper from 'helpers/web/networkHelper';
import { Provider } from 'react-redux';
import { setDataFieldWithID } from 'slices/dataSlice';
import { setHabitFieldWithID } from 'slices/habitSlice';
import App from './App';
import store from './store/store';

jest.mock('firebase/auth');
jest.mock('@capacitor-community/fcm', () => { });

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () => Promise.resolve({ data: {} })
    };
  }
}));

const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};

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

jest.mock('@capacitor/app', () => ({
  App: {
    addListener: jest.fn().mockReturnThis()
  }
}));

jest.mock('helpers/ios/healthKit', () => ({
  init: jest.fn().mockReturnThis()
}));

jest.mock('@capacitor/push-notifications', () => { });

jest.mock('storybook-dark-mode', () => ({
  useDarkMode: jest.fn()
}));

Element.prototype.scrollTo = jest.fn()

describe('App tests', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
    store.dispatch(setDataFieldWithID({ id: 'onboardingDone', value: true }));
    store.dispatch(setDataFieldWithID({ id: 'storeLoaded', value: true }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    });
  });

  console.log('Pls help me');

  test('renders Today page', async () => {
    store.dispatch(setDataFieldWithID({ id: 'onboardingDone', value: true }));
    store.dispatch(setDataFieldWithID({ id: 'storeLoaded', value: true }));
    NetworkHelper.getCompletionInformation = jest.fn().mockResolvedValue({
      CompletedHabits: 1,
      NumberOfDailyHabits: 3,
      PercentComplete: 33
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    const button = screen.getAllByText('No habits scheduled');
    expect(button[0]).toBeVisible();
  });

  test('renders App empty state', () => {
    NetworkHelper.getCompletionInformation = jest.fn().mockResolvedValue({
      CompletedHabits: 1,
      NumberOfDailyHabits: 3,
      PercentComplete: 33
    });
    PlatformHelper.init = jest.fn().mockImplementation(() => ({
      getSteps: () => jest.fn().mockReturnValue(10)
    }));
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const text = screen.getAllByText(/No habits scheduled/i);
    expect(text[0]).toBeInTheDocument();
  });

  test('Renders custom habit modal', async () => {
    store.dispatch(setHabitFieldWithID({ id: 'newHabitOpen', value: true }));
    NetworkHelper.getCompletionInformation = jest.fn().mockResolvedValue({
      CompletedHabits: 1,
      NumberOfDailyHabits: 3,
      PercentComplete: 33
    });
    NetworkHelper.trackActivity = jest.fn().mockResolvedValue(true);
    render(
      <Provider store={store}>
        <CustomHabitContext.Provider
          value={{
            ...BasicHabitContextProps,
            interfacesOpen: {
              ...BasicHabitContextProps.interfacesOpen,
              newHabitOpen: true
            }
          }}
        >
          <App />
        </CustomHabitContext.Provider>
      </Provider>
    );

    const custom = screen.getByTestId('nav-add-habit');
    expect(custom).toBeInTheDocument();
    fireEvent.click(custom);

    await waitFor(() => {
      const title = screen.getByText('Add');
      expect(title).toBeInTheDocument();
    });

    const allButton = screen.getByText('Habits');
    expect(allButton).toBeInTheDocument();
    fireEvent.click(allButton);

    const customHabit = screen.getByText('Create your own habit');
    expect(customHabit).toBeInTheDocument();
    fireEvent.click(customHabit);

    await waitFor(() => {
      const header = screen.getByText('Info');
      expect(header).toBeInTheDocument();
    });
  });
});
