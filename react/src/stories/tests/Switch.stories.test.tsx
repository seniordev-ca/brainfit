// Switch.stories.test.tsx

import React from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Switch.stories';

const { Label, NoLabel, OnToggleFunction } =
  composeStories(stories);

it('renders the Switch with a label', async () => {
  render(<Label {...Label.args} />);
  const switchComponent = screen.getByText(/sample/i);

  expect(switchComponent).toBeInTheDocument();
});

it('renders the Switch with no label', async () => {
  render(<NoLabel {...NoLabel.args} />);
  const switchComponent = screen.queryByText(/sample/i);

  expect(switchComponent).not.toBeInTheDocument();
  expect(screen.getByTestId('switch')).toBeInTheDocument();
});

it('renders the Switch with a onSwitchToggle function', async () => {
  const onSwitchToggle = jest.fn();
  render(<OnToggleFunction {...OnToggleFunction.args} onSwitchToggle={onSwitchToggle} />);
  const elem = screen.getByTestId("switch");

  fireEvent.click(elem);

  await waitFor(() => {
    expect(onSwitchToggle).toBeCalledTimes(1);
  });
});

