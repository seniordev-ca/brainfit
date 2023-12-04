import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'store/store';
import { Terms } from './Terms';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});
jest.mock('contentful', () => ({
    ...jest.requireActual('contentful'), // use actual for all non-hook parts
    createClient: () => {
      return {
        getEntries: () => Promise.resolve({
          items: [
            {
              sys: {
                id: 'Terms ID'
              },
              fields: {
                pillar: 'terms',
                title: 'Terms of Service'
              }
            },
            {
                sys: {
                  id: 'Privacy ID'
                },
                fields: {
                  pillar: 'privacy',
                  title: 'Privacy Policy'
                }
              }
          ]
        })
      }
    }
  }));

describe('Terms of Service Modal tests', () => {
  test('Renders contentful data', async () => {
    const setOpen = jest.fn();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Terms setOpen={setOpen} open={true} />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
        const text = screen.getByText(/Terms of Service/i);
        expect(text).toBeInTheDocument();
      })
  });
});
