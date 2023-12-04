import React from 'react';
import { StartQuestionnaire } from './StartQuestionnaire';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { BrowserRouter } from 'react-router-dom';

jest.mock('@capacitor-community/fcm', () => {

})

jest.mock('@capacitor/core', () => ({
  ...jest.requireActual('@capacitor/core'),
  Capacitor: {
    getPlatform: jest.fn().mockReturnValue('ios')
  }
}))

jest.mock('@capacitor/dialog', () => {

})

jest.mock('helpers/ios/healthKit', () => ({
  init: jest.fn().mockReturnThis()
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

jest.mock('storybook-dark-mode', () => ({
  useDarkMode: jest.fn()
}))


jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () => Promise.resolve({
        items: [
          {
            fields: {
              pillar: 'exercise',
              title: 'Test Question 1',
              description: 'Desc text',
              answers: ['1', '2', '3'],
              values: ['4', '5', '6']
            }
          }
        ]
      })
    }
  }
}));

describe('StartQuestionnaire tests', () => {

  test('renders StartQuestionnaire', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <StartQuestionnaire />
        </BrowserRouter>
      </Provider>
    );
    await waitFor(() => {
      const text = screen.getByText(/your name/i);
      expect(text).toBeInTheDocument();
    })

  });
})
