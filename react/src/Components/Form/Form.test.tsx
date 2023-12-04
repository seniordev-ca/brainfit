import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import store from '../../store/store';
import { Form } from './Form';
import { BrowserRouter } from 'react-router-dom';
import { InputProps } from 'Components/Input/Input';

const inputFields: InputProps[] = [
  {
    type: 'text',
    id: 'name',
    label: 'Name',
    required: true
  },
  {
    type: 'email',
    id: 'email',
    label: 'Email',
    required: true
  },
  {
    type: 'password',
    id: 'password',
    label: 'Password',
    required: true
  },
  {
    type: 'password',
    id: 'confirmPassword',
    label: 'Confirm Password',
    required: true
  }
];

const singleInputField: InputProps[] = [
  {
    type: 'text',
    id: 'name',
    label: 'Name',
    required: true
  }
];

describe('Form Unit Tests', () => {
  test('renders blank Form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Form />
        </BrowserRouter>
      </Provider>
    );
    const text = screen.getByText(/Form/i);
    expect(text).toBeInTheDocument();
  });

  test('renders Form', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Form>
            Simple form
          </Form>
          <label htmlFor="testInput1">Input 1</label>
          <input id="testInput1" type="text" />
        </BrowserRouter>
      </Provider>
    );
    const text = screen.getByText(/Input 1/i);
    expect(text).toBeInTheDocument();
  });

  test('renders Form with input field set', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Form inputFields={inputFields} ></Form>
        </BrowserRouter>
      </Provider>
    );
    const text = screen.getByText(/Email/i);
    expect(text).toBeInTheDocument();
  });

  test('renders Form with input field set and error', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Form inputFields={inputFields} errorMessage={"Invalid email"}></Form>
        </BrowserRouter>
      </Provider>
    );
    const text = screen.getByText(/Invalid email/i);
    expect(text).toBeInTheDocument();
  });

  test('renders Form with cancel click handler', () => {
    const handlerObject = {
      cancelHandler() {
        console.log('Cancel clicked')
      }
    }
    const handlerSpy = jest.spyOn(handlerObject, 'cancelHandler');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Form inputFields={inputFields} onCancel={handlerObject.cancelHandler}></Form>
        </BrowserRouter>
      </Provider>
    );
    const cancelButton = screen.getByTestId('formCancel');
    fireEvent.click(cancelButton)
    expect(handlerSpy).toBeCalled();
  });

  test('renders Form with submit click handler', () => {
    const handlerObject = {
      submitHandler() {
        console.log('Submit clicked')
      }
    }
    const handlerSpy = jest.spyOn(handlerObject, 'submitHandler');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Form inputFields={singleInputField} onSubmit={handlerObject.submitHandler}></Form>
        </BrowserRouter>
      </Provider>
    );
    const input = screen.getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'Test' } });

    const submitButton = screen.getByTestId('formSubmit');
    fireEvent.click(submitButton)
    expect(handlerSpy).toBeCalled();
  });

  test('renders Form with submit click handler values on sumbit', () => {
    const handlerObject = {
      submitHandler() {
        console.log('Submit clicked')
      }
    }
    const handlerSpy = jest.spyOn(handlerObject, 'submitHandler');
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Form inputFields={singleInputField} valuesOnSubmit onSubmit={handlerObject.submitHandler}></Form>
        </BrowserRouter>
      </Provider>
    );

    const input = screen.getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'Test' } });

    const submitButton = screen.getByTestId('formSubmit');
    fireEvent.click(submitButton)
    expect(handlerSpy).toBeCalled();
  });
})