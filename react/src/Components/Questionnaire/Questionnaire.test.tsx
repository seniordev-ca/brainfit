/* eslint-disable testing-library/no-wait-for-side-effects */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { Questionnaire } from './Questionnaire';
import NetworkHelper from 'helpers/web/networkHelper';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => mockAuth
}));

jest.mock('storybook-dark-mode', () => ({
  useDarkMode: jest.fn()
}));

jest.mock('@capacitor-community/fcm', () => { });

jest.mock('@capacitor/core', () => ({
  ...jest.requireActual('@capacitor/core'),
  Capacitor: {
    getPlatform: jest.fn().mockReturnValue('web'),
    registerPlugin: jest.fn()
  }
}));


jest.mock('@capacitor/keyboard', () => ({
  Keyboard: {
    addListener: () => jest.fn()
  }
}));

jest.mock('@capacitor/dialog', () => { });

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () =>
        Promise.resolve({
          items: [
            {
              sys: { id: 'one' },
              fields: {
                pillar: 'exercise',
                title: 'Test Question 1',
                description: 'Desc text',
                answers: ['1', '2', '3'],
                values: ['4', '5', '6']
              }
            },
            {
              sys: { id: 'two' },
              fields: {
                pillar: 'social',
                title: 'Social Question 1',
                description: 'Desc text',
                answers: ['1', '2', '3'],
                values: ['4', '5', '6']
              }
            }
          ]
        })
    };
  }
}));

NetworkHelper.submitQuestionnaireData = jest.fn();

describe('Questionnaire Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Questionnaire', async () => {
    render(
      <Provider store={store}>
        <Questionnaire />
      </Provider>
    );
    await waitFor(() => {
      const text = screen.getByText(/your name/i);
      expect(text).toBeInTheDocument();
    });
  });

  test('Questionnaire moves forward when answered', async () => {
    render(
      <Provider store={store}>
        <Questionnaire />
      </Provider>
    );

    await waitFor(() => {
      const nextButton = screen.getByTestId('next');
      fireEvent.click(nextButton);

      const text = screen.getByText(/from/i);
      expect(text).toBeInTheDocument();
    });
  });

  test('Questionnaire moves back if it can', async () => {
    render(
      <Provider store={store}>
        <Questionnaire />
      </Provider>
    );

    await waitFor(() => {
      const prevButton = screen.getByTestId('previous');
      fireEvent.click(prevButton);

      const text = screen.getByText(/your name/i);
      expect(text).toBeInTheDocument();
    });
  });
});
