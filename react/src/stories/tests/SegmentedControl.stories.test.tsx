// SegmentedControl.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../SegmentedControl.stories';

const { TwoOptions, ThreeOptions, FourOptions } =
  composeStories(stories);

it('renders the Control with two options', () => {
  render(<TwoOptions {...TwoOptions.args} />);
  let text = screen.getByText(/Option 1/i);
  expect(text).toBeInTheDocument();
  text = screen.getByText(/Option 2/i);
  expect(text).toBeInTheDocument();
});

it('renders the Control with three options', () => {
  render(<ThreeOptions {...ThreeOptions.args} />);
  let text = screen.getByText(/Option 1/i);
  expect(text).toBeInTheDocument();
  text = screen.getByText(/Option 2/i);
  expect(text).toBeInTheDocument();
  text = screen.getByText(/Option 3/i);
  expect(text).toBeInTheDocument();
});


it('renders the Control with four options', () => {
  render(<FourOptions {...FourOptions.args} />);
  let text = screen.getByText(/Option 1/i);
  expect(text).toBeInTheDocument();
  text = screen.getByText(/Option 2/i);
  expect(text).toBeInTheDocument();
  text = screen.getByText(/Option 3/i);
  expect(text).toBeInTheDocument();
  text = screen.getByText(/Option 4/i);
  expect(text).toBeInTheDocument();
});

