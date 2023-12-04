import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from 'store/store';
import { Reauthenticate } from './ReAuthenticate';

jest.mock('firebase/auth');

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

describe('ReAuth tests', () => {
  test('Renders reAuthenticate page', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Reauthenticate />
        </ BrowserRouter>
      </Provider>
    );

    const text = screen.getByText('Enter sign in information');
    expect(text).toBeInTheDocument();
  });

  test('Invalid on form error', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Reauthenticate />
        </ BrowserRouter>
      </Provider>
    );

    const submit = screen.getByText('Re sign-in');
    expect(submit).toBeInTheDocument();
    fireEvent.click(submit);

    await waitFor(() => {
      const error = screen.getByText('Please enter username.');
      expect(error).toBeInTheDocument();
    })
  })

  //NOTE: This test is not currently possible without detailed auth mocks
  // test('Valid input deletes users', async () => {
  //   render(
  //     <Provider store={store}>
  //       <BrowserRouter>
  //         <Reauthenticate />
  //       </ BrowserRouter>
  //     </Provider>
  //   );

  //   const emailInput = screen.getByPlaceholderText('Email');
  //   fireEvent.change(emailInput, { target: { value: 'email@email.ca' } })

  //   const passwordInput = screen.getByPlaceholderText('Password');
  //   fireEvent.change(passwordInput, { target: { value: 'password' } });

  //   const submit = screen.getByText('Re sign-in');
  //   expect(submit).toBeInTheDocument();
  //   fireEvent.click(submit);

  //   await waitFor(() => {
  //     expect(mockNavigate).toBeCalledWith('/onboarding');
  //   })
  // })
})