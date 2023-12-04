import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { Progress } from './Progress';
import { NavigationState } from 'slices/navigationSlice';

describe('Progress Unit Tests', () => {
  test('renders Progress', () => {
    render(
      <Provider store={store}>
        <Progress id="step1" header="label" />
      </Provider>
    );
    const text = screen.getByText(/label/i);
    expect(text).toBeInTheDocument();
  });

  test('performs click event on Progress', () => {
    render(
      <Provider store={store}>
        <Progress id="home" header="label" />
      </Provider>
    );
    const input = screen.getByRole('button');
    fireEvent.click(input);
    const nav: NavigationState = store.getState().navigation;

    expect(nav.currentStep).toEqual('home');
  });

  test('performs enter key press event on Progress', () => {
    render(
      <Provider store={store}>
        <Progress id="home" header="label" />
      </Provider>
    );
    const input = screen.getByRole('button');
    fireEvent.keyPress(input, { keyCode: 13, key: 'Enter' });
    const nav: NavigationState = store.getState().navigation;

    expect(nav.currentStep).toEqual('home');
  });

});
