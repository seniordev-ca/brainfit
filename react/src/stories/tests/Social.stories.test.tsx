// Social.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Social.stories';

const { SocialLinks } = composeStories(stories);

it('renders the FooterTemplate', () => {
  render(<SocialLinks {...SocialLinks.args} />);
  expect(screen.queryAllByRole('link').length).toEqual(4);
});
