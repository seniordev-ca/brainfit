import React from 'react';
import { render, screen } from '@testing-library/react';
import { Typography } from './Typography';

test('renders display Typography', () => {
  render(<Typography usage="display" content="content" />);
  const text = screen.getByText(/content/i);
  expect(text).toBeInTheDocument();
});

test('renders headingLarge Typography', () => {
  render(<Typography usage="headingLarge" content="content" />);
  const text = screen.getByText(/content/i);
  expect(text).toBeInTheDocument();
});

test('renders headingMedium Typography', () => {
  render(<Typography usage="headingMedium" content="content" />);
  const text = screen.getByText(/content/i);
  expect(text).toBeInTheDocument();
});

test('renders headingSmall Typography', () => {
  render(<Typography usage="headingSmall" content="content" />);
  const text = screen.getByText(/content/i);
  expect(text).toBeInTheDocument();
});

test('renders body Typography', () => {
  render(<Typography usage="body" content="content" />);
  const text = screen.getByText(/content/i);
  expect(text).toBeInTheDocument();
});

test('renders captionMedium Typography', () => {
  render(<Typography usage="captionMedium" content="content" />);
  const text = screen.getByText(/content/i);
  expect(text).toBeInTheDocument();
});

test('renders captionRegular Typography', () => {
  render(<Typography usage="captionRegular" content="content" />);
  const text = screen.getByText(/content/i);
  expect(text).toBeInTheDocument();
});

test('renders tabBarTablet Typography', () => {
  render(<Typography usage="tabBarTablet" content="content" />);
  const text = screen.getByText(/content/i);
  expect(text).toBeInTheDocument();
});

test('renders tabBar Typography', () => {
  render(<Typography usage="tabBar" content="content" />);
  const text = screen.getByText(/content/i);
  expect(text).toBeInTheDocument();
});

test('renders historyBold Typography', () => {
  render(<Typography usage="historyBold" content="content" />);
  const text = screen.getByText(/content/i);
  expect(text).toBeInTheDocument();
});

test('renders historyRegular Typography', () => {
  render(<Typography usage="historyRegular" content="content" />);
  const text = screen.getByText(/content/i);
  expect(text).toBeInTheDocument();
});