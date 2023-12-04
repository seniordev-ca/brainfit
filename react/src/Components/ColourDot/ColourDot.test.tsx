import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'store/store';
import { ColourDot } from './ColourDot';

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

describe('Colour Dot test', () => {
  test('Renders red coloured dot', async () => {

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ColourDot dotColour='red'/>
        </BrowserRouter>
      </Provider>
    );

    const redDot = screen.getByTestId('red');
    expect(redDot).toBeInTheDocument();
  });
});
