// Loader.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Loader.stories';

const { Default, CustomLoader, CustomLoaderCustomText, CustomLoaderHiddenText } = composeStories(stories);

it('renders the default loader', () => {
  render(<Default {...Default.args} />);
  const text = screen.getByText('Loading');
  expect(text).toBeInTheDocument();
});

it('renders the custom loader item', () => {
  render(<CustomLoader {...CustomLoader.args} />);
  const text = screen.getByText('Loading');
  expect(text).toBeInTheDocument();
});

it('renders the custom loader with custom text', () => {
  render(<CustomLoaderCustomText {...CustomLoaderCustomText.args} />);
  const text = screen.getByText(/Something else/i);
  expect(text).toBeInTheDocument();
});

it('renders the custom loader with hidden text', () => {
  render(<CustomLoaderHiddenText {...CustomLoaderHiddenText.args} />);
  const loader = screen.getByRole('status');
  expect(loader).toBeInTheDocument();
});
