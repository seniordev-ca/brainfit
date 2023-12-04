import React from 'react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { render, screen } from '@testing-library/react';
import { FollowUs } from './FollowUs'
import { BrowserRouter } from 'react-router-dom';

let auth = {
  currentUser: {
    isAnonymous: false
  }
}

jest.mock('storybook-dark-mode', () => ({
  useDarkMode: jest.fn()
}))

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => {return auth},
}));

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () => Promise.resolve({ data: {} })
    }
  }
}));

describe('Follow Us Unit Tests', () => {
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
  
  test('Renders Follow Us page', () => {
    render(
        <Provider store={store}>
        <BrowserRouter>
            <FollowUs />
        </ BrowserRouter>
        </Provider>
    );
  const text = screen.getByText(/follow us/i);
  expect(text).toBeInTheDocument(); })
})