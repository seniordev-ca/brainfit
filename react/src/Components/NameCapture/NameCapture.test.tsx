import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { NameCapture } from './NameCapture';

describe('NameCapture Unit Tests', () => {
  test('renders NameCapture', async () => {
    render(
      <Provider store={store}>
        <NameCapture />
      </Provider>
    );
    const text = screen.getByText(/name/i);
    expect(text).toBeInTheDocument();
  });

  test('renders NameCapture with name', async () => {
    render(
      <Provider store={store}>
        <NameCapture answer='test' />
      </Provider>
    );
    const text = screen.getByDisplayValue(/test/i);
    expect(text).toBeInTheDocument();
  });
});
