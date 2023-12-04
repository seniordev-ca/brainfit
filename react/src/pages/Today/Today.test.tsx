import { render, screen } from '@testing-library/react';
import { StateHelperContextProvider } from 'contexts/stateHelper.context';
import NetworkHelper from 'helpers/web/networkHelper';
import { Provider } from 'react-redux';
import { setDataFieldWithID } from 'slices/dataSlice';
import store from 'store/store';
import { Today } from './Today';
// import { setDataFieldWithID } from 'slices/dataSlice';
// import PlatformHelper from 'helpers/platformHelper';

const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};
// const superagent = require('superagent');

jest.mock('@capacitor/push-notifications', () => ({
  Capacitor: {
    registerPlugin: jest.fn()
  },
  PushNotifications: {
    checkPermissions: () =>
      Promise.resolve({
        receive: 'granted'
      }),
    requestPermissions: jest.fn(),
    register: jest.fn()
  }
}));

jest.mock('@capacitor-community/fcm', () => { });

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

jest.mock('@capacitor/push-notifications', () => ({
  requestPermissions: jest.fn(() => Promise.resolve())
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
jest.mock('@capacitor/dialog', () => { });

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

describe('Today page tests', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    store.dispatch(setDataFieldWithID({ id: 'onboardingDone', value: true }));
  });

  test('renders Today page', () => {
    NetworkHelper.getCompletionInformation = jest.fn().mockResolvedValue({
      CompletedHabits: 1,
      NumberOfDailyHabits: 3,
      PercentComplete: 33
    });

    render(
      <Provider store={store}>
        <StateHelperContextProvider>
          {/* <BrowserRouter> */}
          <Today />
        </StateHelperContextProvider>
        {/* </BrowserRouter> */}
      </Provider>
    );

    const text = screen.getByText(/No habits scheduled/i);
    expect(text).toBeInTheDocument();
    // expect(NetworkHelper.getCompletionInformation).toBeCalledTimes(1);
  });

  // test('Renders custom habit modal', async () => {
  //   render(
  //     <Provider store={store}>
  //       <BrowserRouter>
  //         <Today />
  //       </BrowserRouter>
  //     </Provider>
  //   );

  //   const custom = screen.getByText('+');
  //   expect(custom).toBeInTheDocument();
  //   fireEvent.click(custom);

  //   await waitFor(() => {
  //     const title = screen.getByText('Add new habit');
  //     expect(title).toBeInTheDocument();
  //   })

  //   const customHabit = screen.getByText('Create custom habit');
  //   expect(customHabit).toBeInTheDocument();
  //   fireEvent.click(customHabit);

  //   await waitFor(() => {
  //     const header = screen.getByText('Name & Pillar');
  //     expect(header).toBeInTheDocument();
  //   })
  // })

  // test('Error message when submitting blank custom habit', async () => {
  //   render(
  //     <Provider store={store}>
  //       <BrowserRouter>
  //         <Today />
  //       </BrowserRouter>
  //     </Provider>
  //   );

  //   const custom = screen.getByText('+');
  //   expect(custom).toBeInTheDocument();
  //   fireEvent.click(custom);

  //   await waitFor(() => {
  //     const title = screen.getByText('Add new habit');
  //     expect(title).toBeInTheDocument();
  //   })

  //   const customHabit = screen.getByText('Create custom habit');
  //   expect(customHabit).toBeInTheDocument();
  //   fireEvent.click(customHabit);

  //   await waitFor(() => {
  //     const header = screen.getByText('Name & Pillar');
  //     expect(header).toBeInTheDocument();
  //   })

  //   const save = screen.getByText('Save');
  //   fireEvent.click(save);

  //   await waitFor(() => {
  //     const error = screen.getByText('Please fill in title field.');
  //     expect(error).toBeInTheDocument();
  //   })
  // })

  // test('Custom habitModal onClick', async () => {
  //   render(
  //     <Provider store={store}>
  //       <Today />
  //     </Provider>
  //   );

  //   const custom = screen.getByText('+');
  //   expect(custom).toBeInTheDocument();
  //   fireEvent.click(custom);

  //   await waitFor(() => {
  //     const title = screen.getByText('Name & Pillar');
  //     expect(title).toBeInTheDocument();
  //   })

  //   const name = screen.getByPlaceholderText('Enter a name');
  //   expect(name).toBeInTheDocument();
  //   fireEvent.change(name, { target: { value: 'testFirst testLast' } });
  //   await waitFor(() => {
  //     const name1 = screen.getByText('testFirst testLast');
  //     expect(name1).toBeInTheDocument();
  //   })

  //   fireEvent.click(custom);

  //   let pillars = screen.getByText('Pillars');
  //   expect(pillars).toBeInTheDocument();
  //   fireEvent.change(pillars, { target: { value: 'Exercise' } } );

  // })
});
