// Modal.stories.test.tsx

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Modal.stories';

const { DefaultModal } =
  composeStories(stories);

it('renders the default modal', async () => {
  render(<DefaultModal title='title' {...DefaultModal.args} />);

  await waitFor(() => {
    const text = screen.getByText('title');
    expect(text).toBeInTheDocument();
  });
});