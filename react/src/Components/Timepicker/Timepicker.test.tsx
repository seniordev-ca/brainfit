import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import store from '../../store/store';
import { TimePicker } from './Timepicker';

describe('TimePicker Unit Tests', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });
  test('renders TimePicker', () => {
    render(
      <Provider store={store}>
        <TimePicker
          id="timepickerTest"
          label="label"
          errorText=''
        />
      </Provider>
    );
    const text = screen.getByText(/label/i);
    expect(text).toBeInTheDocument();
  });

  test('renders TimePicker with error', () => {
    render(
      <Provider store={store}>
        <TimePicker
          id="timepickerTest"
          label="label"
          errorText='Error message'
        />
      </Provider>
    );
    const text = screen.getByText(/Error message/i);
    expect(text).toBeInTheDocument();
  });

  // test('TimePicker parses correct date', () => {
  //   render(
  //     <Provider store={store}>
  //       <TimePicker
  //         id="timepickerTest"
  //         label="label"
  //         errorText=''
  //       />
  //     </Provider>
  //   );
  //   const hours = screen.getByRole('spinbutton', { name: 'hours' });
  //   fireEvent.change(hours, { target: { value: '4' } });
  //   const minutes = screen.getByRole('spinbutton', { name: 'minutes' });
  //   fireEvent.change(minutes, { target: { value: '13' } });
  //   fireEvent.blur(minutes);
  //   let date = new Date();
  //   date.setHours(16);
  //   date.setMinutes(13);
  //   const { data }: DataState = store.getState().data;

  //   expect(data.timepickerTest).toEqual(date.toUTCString());
  // });

  // test('Datepicker does not parse incorrect date', () => {
  //   render(
  //     <Provider store={store}>
  //       <DatePickerInput
  //         id="datepickerTest"
  //         label="label"
  //         errorText=''
  //       />
  //     </Provider>
  //   );
  //   const input = screen.getByRole('combobox');
  //   fireEvent.change(input, { target: { value: 'bad-data' } });
  //   fireEvent.blur(input);
  //   expect(screen.queryByDisplayValue('bad-data')).toBeNull();
  // });
})