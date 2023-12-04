import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { BrowserRouter } from 'react-router-dom';
import { ResetPassword } from './ResetPassword';


jest.mock('firebase/auth');

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

describe('Reset password tests', () => {
  test('Renders Reset password page', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ResetPassword />
        </ BrowserRouter>
      </Provider>
    )

    const text = screen.getByText('Send reset link');
    expect(text).toBeInTheDocument();
  })

  test('Invalid email causes error', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ResetPassword />
        </ BrowserRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText('Email');
    fireEvent.change(input, { target: { value: "notAnEmail" } });

    const submit = screen.getByLabelText('Send reset link');
    fireEvent.click(submit);

    await waitFor(() => {
      const text = screen.getByText('Incorrect email format');
      expect(text).toBeInTheDocument();
    });
  })

  test("valid email address sends email", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ResetPassword />
        </ BrowserRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText('Email');
    fireEvent.change(input, { target: { value: "test@test.ca" } });

    const submit = screen.getByLabelText('Send reset link');
    fireEvent.click(submit);

    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith('/login');
    });
  })
})