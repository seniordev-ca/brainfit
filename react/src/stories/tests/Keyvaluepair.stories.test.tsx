// Keyvaluepair.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Keyvaluepair.stories';

const { Default } = composeStories(stories);

it('renders the component with default key', () => {
  render(<Default {...Default.args} />);
  const text = screen.getByText('Policy Holder');
  expect(text).toBeInTheDocument();
});

it('renders the component with default value', () => {
  render(<Default {...Default.args} />);
  const text = screen.getByText('John Smith');
  expect(text).toBeInTheDocument();
});

it('renders the component with custom key', () => {
  render(<Default {...Default.args} kvpKey="Custom key" />);
  const text = screen.getByText('Custom key');
  expect(text).toBeInTheDocument();
});

it('renders the component with custom value', () => {
  render(<Default {...Default.args} kvpValue="Custom value" />);
  const text = screen.getByText('Custom value');
  expect(text).toBeInTheDocument();
});