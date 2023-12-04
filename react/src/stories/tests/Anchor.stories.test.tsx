// Anchor.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Anchor.stories';

const { BodyAnchor, FooterAnchor, ImageAnchor } = composeStories(stories);

it('renders the body anchor', () => {
  render(<BodyAnchor {...BodyAnchor.args} />);
  expect(screen.getByRole('link')).toHaveTextContent('Body Anchor');
});

it('renders the footer anchor', () => {
  render(<FooterAnchor {...FooterAnchor.args} />);
  expect(screen.getByRole('link')).toHaveTextContent('Footer Anchor');
});

it('renders the image anchor with custom alt text', () => {
  render(<ImageAnchor {...ImageAnchor.args} alt="image_anchor" />);
  expect(screen.getByAltText('image_anchor')).toHaveAttribute('src', 'react.svg');
});