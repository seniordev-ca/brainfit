import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { BrowserRouter } from 'react-router-dom';
import { ChangeEmail } from './ChangeEmail';

jest.mock('firebase/auth');

const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};

jest.mock('storybook-dark-mode', () => ({
  useDarkMode: jest.fn()
}));

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => mockAuth
}));

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

describe('Change email tests', () => {
  beforeAll(() => {
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    });
  });

  test('Renders Change email page', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangeEmail />
        </BrowserRouter>
      </Provider>
    );

    const text = screen.getByText('Send confirmation link');
    expect(text).toBeInTheDocument();
  });

  test('Invalid email causes error', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ChangeEmail />
        </BrowserRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText('New email address');
    fireEvent.change(input, { target: { value: 'notAnEmail' } });

    const submit = screen.getByLabelText('Send confirmation link');
    fireEvent.click(submit);

    await waitFor(() => {
      const text = screen.getByText('Incorrect email format');
      expect(text).toBeInTheDocument();
    });
  });
});
