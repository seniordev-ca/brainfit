// Timepicker.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Timepicker.stories';

const { Default, ErrorState } = composeStories(stories);

it('renders the TimePicker default state', () => {
  render(<Default {...Default.args} />);
  const text = screen.getByText('Select a time');
  expect(text).toBeInTheDocument();
});

it('renders the TimePicker error state', () => {
  render(<ErrorState {...Default.args} />);
  const text = screen.getByText('Please select a time above');
  expect(text).toBeInTheDocument();
});
