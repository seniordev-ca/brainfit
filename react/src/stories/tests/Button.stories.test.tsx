// Button.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Button.stories';

const { Primary, Secondary } = composeStories(stories);

it('renders the button in the primary state', () => {
  render(<Primary {...Primary.args} />);
  expect(screen.getByRole('button')).toHaveTextContent('Primary Button');
});

it('renders the button in the primary state with custom title', () => {
  render(<Primary {...Primary.args} label='Custom Title' />);
  expect(screen.getByRole('button')).toHaveTextContent('Custom Title');
});

it('renders the button in the secondary state', () => {
  render(<Secondary {...Secondary.args} />);
  expect(screen.getByRole('button')).toHaveTextContent('Secondary Button');
});