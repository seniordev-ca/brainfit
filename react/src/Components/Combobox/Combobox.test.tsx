import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import store from '../../store/store';
import { Combo } from './Combobox';
import { DataState } from '../../slices/dataSlice';

describe('Combobox Unit Tests', () => {
  test('renders Combo', () => {
    render(
      <Provider store={store}>
        <Combo
          id="comboTest"
          label="label"
          data={['New York', 'Tokyo', 'London', 'Toronto', 'Los Angeles']}
        />
      </Provider>
    );
    const text = screen.getByText(/label/i);
    expect(text).toBeInTheDocument();
  });

  test('renders Combo with error text', () => {
    render(
      <Provider store={store}>
        <Combo
          id="comboTest"
          label="label"
          data={['New York', 'Tokyo', 'London', 'Toronto', 'Los Angeles']}
          errorText="Please select a city"
        />
      </Provider>
    );
    const text = screen.getByText(/Please select a city/i);
    expect(text).toBeInTheDocument();
  });

  test('renders Combo with custom change handler', () => {
    const handlerObject = {
      comboHandler() {
        console.log('Combo changed')
      }
    }
    const handlerSpy = jest.spyOn(handlerObject, 'comboHandler');
    render(
      <Provider store={store}>
        <Combo
          id="comboTest"
          label="label"
          data={['New York', 'Tokyo', 'London', 'Toronto', 'Los Angeles']}
          onChange={handlerObject.comboHandler}
        />
      </Provider>
    );
    const comboBox = screen.getByRole('combobox');
    fireEvent.change(comboBox, { target: { value: 'Tokyo' } });
    expect(handlerSpy).toBeCalled();
  });

  test('choose Combo value from list', () => {
    render(
      <Provider store={store}>
        <Combo
          id="comboTest"
          label="label"
          data={['New York', 'Tokyo', 'London', 'Toronto', 'Los Angeles']}
        />
      </Provider>
    );
    const comboBox = screen.getByRole('combobox');
    fireEvent.change(comboBox, { target: { value: 'Tokyo' } });
    expect(screen.getByDisplayValue('Tokyo')).toBeInTheDocument();
  });

  test('choose Combo value not on list', () => {
    render(
      <Provider store={store}>
        <Combo
          id="comboTest"
          label="label"
          data={['New York', 'Tokyo', 'London', 'Toronto', 'Los Angeles']}
        />
      </Provider>
    );
    const comboBox = screen.getByRole('combobox');
    fireEvent.change(comboBox, { target: { value: 'Kitchener' } });
    expect(screen.getByDisplayValue('Kitchener')).toBeInTheDocument();
  });
});

test('confirm Combobox text propagated to policy store', () => {
  render(
    <Provider store={store}>
      <Combo
        id="comboTest"
        label="label"
        data={['New York', 'Tokyo', 'London', 'Toronto', 'Los Angeles']}
      />
    </Provider>
  );
  const comboBox = screen.getByRole('combobox');
  fireEvent.change(comboBox, { target: { value: 'Tokyo' } });
  const { data }: DataState = store.getState().data;

  expect(data.comboTest).toEqual('Tokyo');
});
