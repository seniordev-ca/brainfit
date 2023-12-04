import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '../../store/store';
import { AboutContent } from './AboutContent';

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () => Promise.resolve({
        items: [
          {
            sys: {
              id: 'About ID'
            },
            fields: {
              pillar: 'about',
              title: 'Test About'
            }
          }
        ]
      })
    }
  }
}));

describe('About Unit Tests', () => {
  test('renders about page', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <AboutContent />
        </BrowserRouter>
      </Provider>
    );
    await waitFor(() => {
      const text = screen.getByText(/Why we built this/i);
      expect(text).toBeInTheDocument();
    })
  });
});