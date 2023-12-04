// Scroller.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Scroller.stories';

const { DefaultScroller, NonInfiniteScroller } = composeStories(stories);

it('renders the Scroller in the primary state', () => {
  render(<DefaultScroller {...DefaultScroller.args} />);
  const text = screen.queryAllByText('24');
  expect(text.length).toEqual(4);
});

it('renders the Non infinite Scroller in the primary state', () => {
  render(<NonInfiniteScroller {...NonInfiniteScroller.args} />);
  const text = screen.queryAllByText('day');
  expect(text.length).toEqual(2);
});

