import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { BrowserRouter } from 'react-router-dom';
import { ResetPasswordContinue } from './ResetPasswordContinue';

jest.mock('firebase/auth');

const mockNavigate = jest.fn();

jest.spyOn(URLSearchParams.prototype, "get").mockReturnValue("some value");

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

describe('Reset Password Continue tests', () => {
  test('Renders reset password continue page', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ResetPasswordContinue />
        </ BrowserRouter>
      </Provider>
    );

    const text = screen.getByText('Create password');
    expect(text).toBeInTheDocument();
  })

  test('Invalid password causes error', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ResetPasswordContinue />
        </ BrowserRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText('New password');
    fireEvent.change(input, { target: { value: "8letters" } });

    const confirm = screen.getByPlaceholderText('Confirm new password');
    fireEvent.change(confirm, { target: { value: "8le" } });

    const submit = screen.getByLabelText('Create password');
    fireEvent.click(submit);

    await waitFor(() => {
      const text = screen.getByText('"Password" does not match');
      expect(text).toBeInTheDocument();
    });
  })

  test("valid input changes password", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ResetPasswordContinue />
        </ BrowserRouter>
      </Provider>
    );

    const input = screen.getByPlaceholderText('New password');
    fireEvent.change(input, { target: { value: "Password1!" } });

    const input2 = screen.getByPlaceholderText('Confirm new password');
    fireEvent.change(input2, { target: { value: "Password1!" } });

    const submit = screen.getByLabelText('Create password');
    fireEvent.click(submit);

    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith('/login');
    });
  })
})