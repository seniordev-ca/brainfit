import React from 'react';
import { Settings } from './Settings';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { BrowserRouter } from 'react-router-dom';

const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};

jest.mock('storybook-dark-mode', () => ({
  useDarkMode: jest.fn()
}));

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => {
    return mockAuth;
  }
}));

describe('Settings page tests', () => {
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
  test('renders Settings page', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Settings />
        </BrowserRouter>
      </Provider>
    );
    const text = screen.getByText(/Settings/i);
    expect(text).toBeInTheDocument();
  });
});
