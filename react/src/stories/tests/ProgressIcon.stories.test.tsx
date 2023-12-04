// ProgressIcon.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../ProgressIcon.stories';

const { ProgressWithIcon, DefaultProgress, GradientProgressWithIcon } =
  composeStories(stories);

it('renders the default ProgressIcon', async () => {
  render(<DefaultProgress {...DefaultProgress.args} progress={50} />);
  const button = screen.getByText(/50/i);

  expect(button).toBeInTheDocument();
});

it('renders the ProgressIcon with Icon', async () => {
  render(<ProgressWithIcon {...ProgressWithIcon.args} />);

  expect(screen.getByTestId('progressIcon')).toBeInTheDocument();
});

it('renders the Progress with gradient stroke and icon', async () => {
  render(<GradientProgressWithIcon {...GradientProgressWithIcon.args} />);

  expect(screen.getByTestId('progressIcon')).toBeInTheDocument();
});