import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import store from '../../store/store';
import { Checkbox } from './Checkbox';
import { DataState } from 'slices/dataSlice';

test('renders Checkbox', () => {
  render(
    <Provider store={store}>
      <Checkbox id="sampleCheckbox" message="label" />
    </Provider>
  );
  const text = screen.getByText(/label/i);
  expect(text).toBeInTheDocument();
});

test('renders Checkbox with error state', () => {
  render(
    <Provider store={store}>
      <Checkbox
        id="sampleCheckbox"
        message="label"
        errorText="Please check this box"
      />
    </Provider>
  );
  const text = screen.getByText(/Please check this box/i);
  expect(text).toBeInTheDocument();
});

test('Checkbox toggles value in datastore', () => {
  render(
    <Provider store={store}>
      <Checkbox id="sampleCheckbox" message="label" />
    </Provider>
  );
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);
  const { data }: DataState = store.getState().data;
  expect(data.sampleCheckbox).toEqual(true);
});

test('Checkbox toggles value in collection', () => {
  render(
    <Provider store={store}>
      <Checkbox id="sampleCheckbox" addToCollection="testCollection" message="label" />
    </Provider>
  );
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);
  const { data }: DataState = store.getState().data;
  expect(data.sampleCheckbox).toEqual(false);
  expect(data.testCollection).toEqual(['sampleCheckbox'])
});