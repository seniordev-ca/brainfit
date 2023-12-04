import { BrowserRouter } from 'react-router-dom';
import { Login } from './Login';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import store from 'store/store';

const mockNavigate = jest.fn();
const mockSignIn = jest.fn();

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
    fillField(field.label, field.value)
  })
}


jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

const auth = {}

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => auth,
  signInWithEmailAndPassword: () => mockSignIn()
}));

describe('Login Page Unit Tests', () => {
  test('Renders login page', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </ BrowserRouter>
      </Provider>
    );

    const text = screen.getAllByText(/Sign in/i);
    expect(text.length).toBe(2)
  });

  test('Renders error messages on unsuccessful login', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </ BrowserRouter>
      </Provider>
    );

    const fields: Array<FieldData> = [
      {
        label: "Email", value: 'invalid'
      },
      {
        label: "Password", value: 'valid'
      }]

    fillFields(fields);

    const button = screen.getByTestId('formSubmit');
    fireEvent.click(button);

    const text = screen.getByText(/Email or password not recognized in our system. Please try another email or password./i);
    expect(text).toBeInTheDocument();
  })

  test('Successful login', async () => {
    mockSignIn.mockImplementation(() => {
      return Promise.resolve("Success")
    })
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </ BrowserRouter>
      </Provider>
    );

    const fields: Array<FieldData> = [{
      label: "Email", value: 'test@test.ca'
    },
    { label: "Password", value: "password" }
    ]

    fillFields(fields);
    const button = screen.getByTestId('formSubmit');
    fireEvent.click(button);

    await new Promise(process.nextTick);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  })

  test('Firebase fail, unsuccessful login', async () => {
    mockSignIn.mockImplementation(() => {
      return Promise.reject("Fail")
    })
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </ BrowserRouter>
      </Provider>
    );

    const fields: Array<FieldData> = [{
      label: "Email", value: 'test@test.ca'
    },
    { label: "Password", value: "password" }
    ]

    fillFields(fields);
    const button = screen.getByTestId('formSubmit');

    fireEvent.click(button);

    await waitFor(() => {
      const text = screen.getByText("Email or password not recognized in our system. Please try another email or password.");
      expect(text).toBeInTheDocument();
    })
  });
})