import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { Question } from './Question';

jest.mock('@capacitor-community/fcm', () => {

})

jest.mock('@capacitor/core', () => ({
  ...jest.requireActual('@capacitor/core'),
  Capacitor: {
    getPlatform: jest.fn().mockReturnValue('ios'),
    registerPlugin: jest.fn()
  }
}));

jest.mock('@capacitor/dialog', () => { });

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

describe('Question Unit Tests', () => {
  test('renders first Question component', async () => {
    render(
      <Provider store={store}>
        <Question index={0} />
      </Provider>
    );
    const text = screen.getByText(/your name/i);
    expect(text).toBeInTheDocument();

  });

  test('renders first Question component with answer', async () => {
    render(
      <Provider store={store}>
        <Question index={0} answer='test' />
      </Provider>
    );
    const text = screen.getByDisplayValue(/test/i);
    expect(text).toBeInTheDocument();

  });
});
