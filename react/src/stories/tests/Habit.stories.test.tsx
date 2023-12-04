// Habit.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Habit.stories';

const { Primary, BoldedTitle } = composeStories(stories);

it('renders the habit', () => {
  render(<Primary {...Primary.args} />);
  const test = screen.getByText('Habit to form')
  expect(test).toBeInTheDocument()
});

it('renders the habit with bolded text', () => {
  render(<BoldedTitle {...BoldedTitle.args} />);
  const test = screen.getByText('Habit to form')
  expect(test).toBeInTheDocument()
});
