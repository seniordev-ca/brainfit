// NavTabItem.stories.test.tsx

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../NavTabItem.stories';

const { Progress, Explore, Settings, Home } =
  composeStories(stories);

it('renders the progress NavTabItem', async () => {
  render(<Progress  {...Progress.args} />);

  await waitFor(() => {
    const text = screen.getByText('Progress');
    expect(text).toBeInTheDocument();
  });
});

it('renders the explore NavTabItem', async () => {
  render(<Explore  {...Explore.args} />);

  await waitFor(() => {
    const text = screen.getByText('Explore');
    expect(text).toBeInTheDocument();
  });
});

it('renders the settings NavTabItem', async () => {
  render(<Settings  {...Settings.args} />);

  await waitFor(() => {
    const text = screen.getByText('Settings');
    expect(text).toBeInTheDocument();
  });
});

it('renders the Home NavTabItem', async () => {
  render(<Home  {...Home.args} />);

  await waitFor(() => {
    const text = screen.getByText('Home');
    expect(text).toBeInTheDocument();
  });
});