// ExpandedCalendar.stories.test.tsx

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../ExpandedCalendar.stories';

jest.mock('helpers/stateHelper', () => {
  return {
    ...jest.requireActual('helpers/stateHelper'),
    useUserHabits: () => {
      return {
        habits: []
      }
    }
  }
})

const { DefaultExpandedCalendar, } =
  composeStories(stories);

it('renders the default ExpandedCalendar', async () => {
  render(<DefaultExpandedCalendar {...DefaultExpandedCalendar.args} />);

  await waitFor(() => {
    const text = screen.getByText(/january/i);
    expect(text).toBeInTheDocument();
  });
});
