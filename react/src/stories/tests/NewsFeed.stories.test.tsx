// NewsFeed.stories.test.tsx

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../NewsFeed.stories';

const { DefaultNewsFeed } = composeStories(stories);

it('renders the default news feed', () => {
  render(<DefaultNewsFeed {...DefaultNewsFeed.args} />);

  const text = screen.getByText(/exercise/i);
  expect(text).toBeInTheDocument();
});
