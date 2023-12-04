// DateTimePicker.stories.test.tsx

import React from 'react';

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../TimeSpinner.stories';

const { DefaultTimeSpinner } = composeStories(stories);

it('renders the DateTimePicker in the primary state', () => {
  render(<DefaultTimeSpinner {...DefaultTimeSpinner.args} />);
  const text = screen.queryAllByText('59');
  expect(text.length).toEqual(4);
});