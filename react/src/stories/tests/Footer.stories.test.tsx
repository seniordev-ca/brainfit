// Footer.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Footer.stories';

const { FooterTemplate } = composeStories(stories);

it('renders the FooterTemplate', () => {
  render(<FooterTemplate {...FooterTemplate.args} />);
  const text = screen.getByText(new RegExp(/COMPANY LOGO/i));
  expect(text).toBeInTheDocument();
});
