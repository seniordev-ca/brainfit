import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

test('renders Button', () => {
  render(<Button label="label" />);
  const text = screen.getByText(/label/i);
  expect(text).toBeInTheDocument();
});

test('renders Button in primary mode', () => {
  render(<Button buttonType="btn-primary" label="Primary label" />);
  const text = screen.getByText(/Primary label/i);
  expect(text).toBeInTheDocument();
});

test('renders Button with click handler', () => {
  const handlerObject = {
    buttonHandler() {
      console.log('Button clicked')
    }
  }
  const handlerSpy = jest.spyOn(handlerObject, 'buttonHandler');
  render(<Button buttonType="btn-primary" label="Primary label" onClick={handlerObject.buttonHandler} />);
  const button = screen.getByRole('button');
  fireEvent.click(button)
  expect(handlerSpy).toBeCalled();
});