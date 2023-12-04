import { render, screen } from '@testing-library/react';
import { Appearance } from './Appearance';
import { Provider } from 'react-redux';
import store from 'store/store';
import { BrowserRouter } from 'react-router-dom';

jest.mock('storybook-dark-mode', () => ({
    useDarkMode: jest.fn()
  }))
  describe('Appearance page tests', () => {
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
    test('renders Appearance', () => {
        render(
        <Provider store={store}>
            <BrowserRouter>
                <Appearance open={true} setOpen={jest.fn()}/>
            </BrowserRouter>    
        </Provider>
        );
        const text = screen.getByText(/Appearance/i);
        expect(text).toBeInTheDocument();
    });
  });