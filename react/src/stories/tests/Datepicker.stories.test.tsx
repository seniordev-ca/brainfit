// Datepicker.stories.test.tsx

import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Datepicker.stories';

const { Default, ErrorState } =
  composeStories(stories);

it('renders the DateInput with valid text', () => {
  render(<Default {...Default.args} />);
  const input = screen.getByRole('combobox');

  // @ts-ignore
  fireEvent.change(input, { target: { value: '2020-11-17' } });
  expect(screen.getByDisplayValue('2020-11-17')).toBeInTheDocument();
});

it('renders the DateInput with invalid text', () => {
  render(<ErrorState {...ErrorState.args} />);
  const input = screen.getByRole('combobox');

  // @ts-ignore
  fireEvent.change(input, { target: { value: 'abc' } });

  if (input) fireEvent.blur(input);
  expect(screen.queryByDisplayValue('abc')).toBeNull();
});