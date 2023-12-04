import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import store from '../../store/store';
import { Select } from './Select';

test('renders Select', () => {
  render(
    <Provider store={store}>
      <Select id="selectTest" label="label" />
    </Provider>
  );
  const text = screen.getByText(/label/i);
  expect(text).toBeInTheDocument();
});

test('renders Select error message', () => {
  render(
    <Provider store={store}>
      <Select
        id="selectTest"
        label="label"
        errorText="Please select an option"
      />
    </Provider>
  );
  const text = screen.getByText(/Please select an option/i);
  expect(text).toBeInTheDocument();
});
