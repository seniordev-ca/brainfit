// Progress.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Progress.stories';

const { Incomplete, Active, Complete, SubItem } = composeStories(stories);

it('renders the Incomplete progress item', () => {
  render(<Incomplete {...Incomplete.args} />);
  const text = screen.getByText('Description of Step 1');
  expect(text).toBeInTheDocument();
});

it('renders the Active progress item', () => {
  render(<Active {...Active.args} />);
  const text = screen.getByText('Description of Step 1');
  expect(text).toBeInTheDocument();
});

it('renders the Complete progress item', () => {
  render(<Complete {...Complete.args} />);
  const text = screen.getByText('Description of Step 1');
  expect(text).toBeInTheDocument();
});

it('renders the SubItem progress item', () => {
  render(<SubItem {...SubItem.args} />);
  const text = screen.getByText('Description of Step 2a');
  expect(text).toBeInTheDocument();
});
