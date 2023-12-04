import React from 'react';

import { SignUp } from './SignUp';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { BrowserRouter } from 'react-router-dom';
import NetworkHelper from 'helpers/web/networkHelper';

jest.mock('firebase/auth');

interface FieldData {
  label: string;
  value: string;
}

function fillField(labelText: string, value: string) {
  const input = screen.getByPlaceholderText(labelText);
  fireEvent.change(input, { target: { value: value } });
}

function fillFields(fields: Array<FieldData>) {
  fields.forEach((field) => {
    fillField(field.label, field.value);
  });
}

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

jest.mock('firebase/auth');

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

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

jest.mock('storybook-dark-mode', () => ({
  useDarkMode: jest.fn()
}))

describe('Signup page tests', () => {
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
  test('renders signup page', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </Provider>
    );
    const text = screen.getByText(/Sign up/i);
    expect(text).toBeInTheDocument();
  });

  test('Verify form fields', async () => {
    NetworkHelper.registerUser = jest.fn().mockImplementation(() => {
      return true;
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <SignUp />
        </BrowserRouter>
      </Provider>
    );

    const fields: Array<FieldData> = [
      {
        label: 'Name',
        value: 'Test User'
      },
      {
        label: 'Email',
        value: 'test@test.ca'
      },
      {
        label: 'Password',
        value: 'Valid_password123'
      },
    ];

    fillFields(fields);

    const button = screen.getByText('Sign up');
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(button);
    });

    const text = screen.queryByText(/Please complete this field/i);
    expect(text).toBeNull();
  });

  //TODO: 
  // test('Sign up Missing information', () => {
  //   NetworkHelper.registerUser = jest.fn().mockImplementation(() => {
  //     return true;
  //   });

  //   render(
  //     <Provider store={store}>
  //       <BrowserRouter>
  //         <SignUp />
  //       </BrowserRouter>
  //     </Provider>
  //   );
  //   const fields: Array<FieldData> = [
  //     {
  //       label: 'Password',
  //       value: ''
  //     }
  //   ];

  //   fillFields(fields);

  //   const button = screen.getByText('Sign up');
  //   fireEvent.click(button);

  //   expect(button).toBeDisabled()
  // });

  //   test('Skip button renders onboarding', () => {
  //     store.dispatch(setDataFieldWithID({ id: 'onboardingDone', value: false }));
  //     NetworkHelper.registerUser = jest.fn().mockImplementation(() => {
  //       return true;
  //     });

  //     render(
  //       <Provider store={store}>
  //         <BrowserRouter>
  //           <SignUp />
  //         </BrowserRouter>
  //       </Provider>
  //     );

  //     const button = screen.getByText('Skip');
  //     fireEvent.click(button);

  //     expect(mockNavigate).toHaveBeenCalledWith('/');
  //   });

  //   test('Skip button does not render outside onboarding', () => {
  //     store.dispatch(setDataFieldWithID({ id: 'onboardingDone', value: true }));
  //     NetworkHelper.registerUser = jest.fn().mockImplementation(() => {
  //       return true;
  //     });

  //     render(
  //       <Provider store={store}>
  //         <BrowserRouter>
  //           <SignUp />
  //         </BrowserRouter>
  //       </Provider>
  //     );

  //     const button = screen.queryByText('Skip');
  //     expect(button).toBeNull();
  //   });
});
