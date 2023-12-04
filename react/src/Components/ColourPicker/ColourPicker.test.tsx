import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'store/store';
import { ColourPicker } from './ColourPicker';

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

describe('Colour Picker Modal tests', () => {
  test('Renders grid', async () => {

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ColourPicker />
        </BrowserRouter>
      </Provider>
    );

    const custom = screen.getByTestId('colourPickerGrid');
    expect(custom).toBeInTheDocument();
  });
});
