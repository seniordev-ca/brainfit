// ListGroup.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../ListGroup.stories';

const { Primary } =
  composeStories(stories);

it('renders the Text ListItem story', async () => {
  render(<Primary {...Primary.args} />);

  const text = screen.getByText('Test Text');
  expect(text).toBeInTheDocument();

  const heading = screen.getByText('Heading');
  expect(heading).toBeInTheDocument();
});