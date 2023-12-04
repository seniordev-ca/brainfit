// Input.stories.test.tsx

import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../InputStyled.stories';

const { TextInput, UserNameInput, EmailInput, } =
  composeStories(stories);

it('renders the TextInput with valid text', () => {
  render(<TextInput {...TextInput.args} />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'testing 123' } });
  expect(screen.getByDisplayValue('testing 123') === input).toBe(true);
});

it('renders the UserNameInput with valid text', () => {
  render(<TextInput {...UserNameInput.args} />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'testing 123' } });
  expect(screen.getByDisplayValue('testing 123') === input).toBe(true);
});

// it('renders the PasswordInput with valid text', () => {
//   render(<TextInput {...PasswordInput.args} />);
//   const input = screen.getByRole('textbox');
//   fireEvent.change(input, { target: { value: 'testing123' } });
//   expect(screen.getByDisplayValue('testing123') === input).toBe(true);
// });

it('renders the EmailInput with valid text', () => {
  render(<EmailInput {...EmailInput.args} />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'testing@test.ca' } });
  expect(screen.getByDisplayValue('testing@test.ca') === input).toBe(true);
});