// ProgressBar.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';
import { steps } from '../../constants/nav';

import * as stories from '../ProgressBar.stories';

const { ProgressBars } = composeStories(stories);

it('renders the ProgressBars from nav constants', () => {
  render(<ProgressBars {...ProgressBars.args} />);
  const [step] = steps;
  const text = screen.getByText(step.description);
  expect(text).toBeInTheDocument();
});