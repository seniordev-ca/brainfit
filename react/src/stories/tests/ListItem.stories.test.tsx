// ListItem.stories.test.tsx

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../ListItem.stories';

const { Text, TextChevron, TextGlyphChevron, GlyphTextChevron, AllSlotsSecondary, AllSlotsPrimary, TextSwitch, TextTextChevron } =
  composeStories(stories);

it('renders the Text ListItem story', async () => {
  render(<Text {...Text.args} />);

  await waitFor(() => {
    const text = screen.getByText('Text');
    expect(text).toBeInTheDocument();
  });
});

it('renders the TextChevron ListItem story', async () => {
  render(<TextChevron {...TextChevron.args} />);

  await waitFor(() => {
    const text = screen.getByText('Text');
    expect(text).toBeInTheDocument();
  });
});

it('renders the TextGlyphChevron ListItemstory', async () => {
  render(<TextGlyphChevron {...TextGlyphChevron.args} />);

  await waitFor(() => {
    const text = screen.getByText('Text');
    expect(text).toBeInTheDocument();
  });
});

it('renders the GlyphTextChevron ListItem story', async () => {
  render(<GlyphTextChevron {...GlyphTextChevron.args} />);

  await waitFor(() => {
    const text = screen.getByText('Text');
    expect(text).toBeInTheDocument();
  });
});

it('renders the AllSlotsSecondary ListItem story', async () => {
  render(<AllSlotsSecondary {...AllSlotsSecondary.args} />);

  await waitFor(() => {
    const text = screen.getByText('Text');
    expect(text).toBeInTheDocument();
  });
});

it('renders the AllSlotsPrimary ListItem story', async () => {
  render(<AllSlotsPrimary {...AllSlotsPrimary.args} />);

  await waitFor(() => {
    const text = screen.getByText('Text');
    expect(text).toBeInTheDocument();
  });
});

it('renders the TextSwitch ListItem story', async () => {
  render(<TextSwitch {...TextSwitch.args} />);

  await waitFor(() => {
    const text = screen.getByText('Text');
    expect(text).toBeInTheDocument();
  });
});

it('renders the TextTextChevron ListItem story', async () => {
  render(<TextTextChevron {...TextTextChevron.args} />);

  await waitFor(() => {
    const text = screen.queryAllByText('Text');
    expect(text.length).toEqual(2);
  });
});