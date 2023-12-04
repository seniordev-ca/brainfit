import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Switch } from './Switch';

test('renders Switch', () => {
  render(<Switch id='test-switch' label='test switch'/>);
  const text = screen.getByText(/test switch/i);
  expect(text).toBeInTheDocument();
});

test('onSwitchToggle is called', async () => {
  const onSwitchToggle = jest.fn();
  render(<Switch id='test-switch' onSwitchToggle={onSwitchToggle} />);
  const elem = screen.getByTestId("switch");
  fireEvent.click(elem);

  await waitFor(() => {
    expect(onSwitchToggle).toBeCalledTimes(1);
  });
});
