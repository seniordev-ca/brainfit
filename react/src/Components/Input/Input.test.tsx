import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import store from '../../store/store';
import { Input } from './Input';
import { DataState } from '../../slices/dataSlice';

test('renders Input', () => {
  render(
    <Provider store={store}>
      <Input id="inputTest" label="label" />
    </Provider>
  );
  const text = screen.getByText(/label/i);
  expect(text).toBeInTheDocument();
});

test('renders Input with error text', () => {
  render(
    <Provider store={store}>
      <Input id="inputTest" label="label" errorText="Please enter a value" />
    </Provider>
  );
  const text = screen.getByText(/Please enter a value/i);
  expect(text).toBeInTheDocument();
});

test('enter text in Input', () => {
  render(
    <Provider store={store}>
      <Input id="inputTest" label="label" />
    </Provider>
  );
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Tokyo' } });
  expect(screen.getByDisplayValue('Tokyo')).toBeInTheDocument();
});

test('confirm Input text propagated to data store', () => {
  render(
    <Provider store={store}>
      <Input id="inputTest" label="label" />
    </Provider>
  );
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Tokyo' } });
  const { data }: DataState = store.getState().data;

  expect(data.inputTest).toEqual('Tokyo');
});

test('render Input with hint', () => {
  render(
    <Provider store={store}>
      <Input id="inputTest" label="label" hint='hint' />
    </Provider>
  );
  const text = screen.getByText(/hint/i);
  expect(text).toBeInTheDocument();
});

test('render Input with static/prefilled value', () => {
  render(
    <Provider store={store}>
      <Input id="inputTest" label="label" value="Tokyo" />
    </Provider>
  );
  const { data }: DataState = store.getState().data;
  expect(data.inputTest).toEqual('Tokyo');
});
