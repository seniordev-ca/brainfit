import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { BrowserRouter } from 'react-router-dom';
import { DeleteAccount } from './DeleteAccount';

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

describe('Delete account tests', () => {
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

  test('Renders Delete account page', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <DeleteAccount />
        </BrowserRouter>
      </Provider>
    );

    const text = screen.getByText('Delete account');
    expect(text).toBeInTheDocument();
  });
});
