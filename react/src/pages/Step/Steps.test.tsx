import { render, screen } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { renderStep } from './Steps';

const Step: any = (step: string, DataState = {}): ReactElement => {
  const view: ReactElement = renderStep(step);
  return (
    <Provider store={store}>
      <div className="App">{view}</div>
    </Provider>
  );
};

test('renders Home step', () => {
  render(<Step />)

  const text = screen.getByText(/Welcome to BrainFit/i);
  expect(text).toBeInTheDocument();
});
