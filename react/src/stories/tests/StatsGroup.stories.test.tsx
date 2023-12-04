// Input.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../StatsGroup.stories';

const { StatsGroupCard } = composeStories(stories);

it('renders the default StatsGroup', () => {
  render(<StatsGroupCard {...StatsGroupCard.args} />);

  expect(screen.getByText('Longest streak')).toBeInTheDocument();
});