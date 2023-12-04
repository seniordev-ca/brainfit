import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import store from '../../store/store';
import { DatePickerInput } from './Datepicker';

describe('Datepicker Unit Tests', () => {
  test('renders Datepicker', () => {
    render(
      <Provider store={store}>
        <DatePickerInput
          id="datepickerTest"
          label="label"
          errorText=''
        />
      </Provider>
    );
    const text = screen.getByText(/label/i);
    expect(text).toBeInTheDocument();
  });

  test('Datepicker parses correct date', () => {
    render(
      <Provider store={store}>
        <DatePickerInput
          id="datepickerTest"
          label="label"
          errorText=''
        />
      </Provider>
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: '10/10/1990' } });
    expect(screen.getByDisplayValue('10/10/1990')).toBeInTheDocument();
  });

  test('Datepicker does not parse incorrect date', () => {
    render(
      <Provider store={store}>
        <DatePickerInput
          id="datepickerTest"
          label="label"
          errorText=''
        />
      </Provider>
    );
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'bad-data' } });
    fireEvent.blur(input);
    expect(screen.queryByDisplayValue('bad-data')).toBeNull();
  });
})