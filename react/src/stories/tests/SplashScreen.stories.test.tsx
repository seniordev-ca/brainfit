// SplashScreen.stories.test.tsx

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../SplashScreen.stories';

const { DefaultSplashScreen } =
  composeStories(stories);

it('renders the default SplashScreen', async () => {
  render(<DefaultSplashScreen  {...DefaultSplashScreen.args} />);

  await waitFor(() => {
    const text = screen.getByText(/logo/i);
    expect(text).toBeInTheDocument();
  });
});