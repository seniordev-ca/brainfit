// Keyvaluepair.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Typography.stories';

const { Display, HeadingLarge, HeadingMedium, HeadingSmall, Body, CaptionMedium, CaptionRegular, TabBarTablet, TabBar, HistoryBold, HistoryRegular } = composeStories(stories);

it('renders the display component with default value', () => {
  render(<Display {...Display.args} content="The quick brown fox jumps over the lazy dog" />);
  const text = screen.getByText('The quick brown fox jumps over the lazy dog');
  expect(text).toBeInTheDocument();
});

it('renders the HeadingLarge component with default value', () => {
  render(<HeadingLarge {...HeadingLarge.args} content="The quick brown fox jumps over the lazy dog" />);
  const text = screen.getByText('The quick brown fox jumps over the lazy dog');
  expect(text).toBeInTheDocument();
});

it('renders the HeadingMedium component with custom value', () => {
  render(<HeadingMedium {...HeadingMedium.args} content="The quick brown fox jumps over the lazy dog" />);
  const text = screen.getByText('The quick brown fox jumps over the lazy dog');
  expect(text).toBeInTheDocument();
});

it('renders the HeadingSmall component with custom value', () => {
  render(<HeadingSmall {...HeadingSmall.args} content="The quick brown fox jumps over the lazy dog" />);
  const text = screen.getByText('The quick brown fox jumps over the lazy dog');
  expect(text).toBeInTheDocument();
});

it('renders the Body component with custom value', () => {
  render(<Body {...Body.args} content="The quick brown fox jumps over the lazy dog" />);
  const text = screen.getByText('The quick brown fox jumps over the lazy dog');
  expect(text).toBeInTheDocument();
});

it('renders the CaptionMedium component with custom value', () => {
  render(<CaptionMedium {...CaptionMedium.args} content="The quick brown fox jumps over the lazy dog" />);
  const text = screen.getByText('The quick brown fox jumps over the lazy dog');
  expect(text).toBeInTheDocument();
});

it('renders the CaptionRegular component with custom value', () => {
  render(<CaptionRegular {...CaptionRegular.args} content="The quick brown fox jumps over the lazy dog" />);
  const text = screen.getByText('The quick brown fox jumps over the lazy dog');
  expect(text).toBeInTheDocument();
});

it('renders the TabBarTablet component with custom value', () => {
  render(<TabBarTablet {...TabBarTablet.args} content="The quick brown fox jumps over the lazy dog" />);
  const text = screen.getByText('The quick brown fox jumps over the lazy dog');
  expect(text).toBeInTheDocument();
});

it('renders the TabBar component with custom value', () => {
  render(<TabBar {...TabBar.args} content="The quick brown fox jumps over the lazy dog" />);
  const text = screen.getByText('The quick brown fox jumps over the lazy dog');
  expect(text).toBeInTheDocument();
});

it('renders the HistoryBold component with custom value', () => {
  render(<HistoryBold {...HistoryBold.args} content="The quick brown fox jumps over the lazy dog" />);
  const text = screen.getByText('The quick brown fox jumps over the lazy dog');
  expect(text).toBeInTheDocument();
});

it('renders the HistoryRegular component with custom value', () => {
  render(<HistoryRegular {...HistoryRegular.args} content="The quick brown fox jumps over the lazy dog" />);
  const text = screen.getByText('The quick brown fox jumps over the lazy dog');
  expect(text).toBeInTheDocument();
});