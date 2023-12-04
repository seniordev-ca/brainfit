// Checkbox.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Checkbox.stories';

const { Default, ErrorState } = composeStories(stories);

it('renders the Checkbox with default label', () => {
  render(<Default {...Default.args} />);
  const text = screen.getByText('Inline checkbox description');
  expect(text).toBeInTheDocument();
});

it('renders the Checkbox with custom label', () => {
  render(<Default {...Default.args} message='Custom message' />);
  const text = screen.getByText('Custom message');
  expect(text).toBeInTheDocument();
  expect(screen.queryByText('Inline checkbox description')).toBeNull();
});

it('renders the Checkbox with error state', () => {
  render(<ErrorState {...ErrorState.args} />);
  const text = screen.getByText('Please click the checkbox above');
  expect(text).toBeInTheDocument();
});

it('renders the Checkbox with custom error text', () => {
  render(<ErrorState {...ErrorState.args} errorText="Custom message" />);
  const text = screen.getByText('Custom message');
  expect(text).toBeInTheDocument();
});