// Input.stories.test.tsx

import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Select.stories';

const { Primary, ErrorState } = composeStories(stories);

it('renders the default Select with text on the list', () => {
  render(<Primary {...Primary.args} />);
  const input = screen.getByRole('combobox')
  fireEvent.change(input, { target: { value: true} } )
  expect((screen.getByDisplayValue("True") === input)).toBe(true)
});

it('renders the default ErrorState', () => {
  render(<ErrorState {...ErrorState.args} />);
  const text = screen.getByText('Please select something above');
  expect(text).toBeInTheDocument();
});

it('renders the ErrorState with custom error', () => {
  render(<ErrorState {...ErrorState.args} errorText='Custom error message' />);
  const text = screen.getByText('Custom error message');
  expect(text).toBeInTheDocument();
});