// Input.stories.test.tsx

import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Combobox.stories';

const { Default, ErrorState } = composeStories(stories);

it('renders the default Combobox with text on the list', () => {
  render(<Default {...Default.args} />);
  const input = screen.getByRole('combobox')
  fireEvent.change(input, { target: { value: 'New York'} } )
  expect((screen.getByDisplayValue("New York") === input)).toBe(true)
});

it('renders the default Combobox with text not on the list', () => {
  render(<Default {...Default.args} />);
  const input = screen.getByRole('combobox')
  fireEvent.change(input, { target: { value: 'testing123'} } )
  expect((screen.getByDisplayValue("testing123") === input)).toBe(true)
});

it('renders the default ErrorState', () => {
  render(<ErrorState {...ErrorState.args} />);
  const text = screen.getByText('Please select a city above');
  expect(text).toBeInTheDocument();
});

it('renders the ErrorState with custom error', () => {
  render(<ErrorState {...ErrorState.args} errorText='Custom error message' />);
  const text = screen.getByText('Custom error message');
  expect(text).toBeInTheDocument();
});