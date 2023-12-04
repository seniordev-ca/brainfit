// Trainstops.stories.test.tsx

import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Trainstops.stories';

const { ThreeStops, FourStops } =
  composeStories(stories);

const clickFunction = jest.fn()

it('renders the Control with three stops', () => {
  render(<ThreeStops {...ThreeStops.args} />);
  const buttons = screen.getAllByRole('button')
  expect(buttons.length).toBe(3)
});

it('renders the Control with four stops', () => {
  render(<FourStops {...FourStops.args} />);
  const buttons = screen.getAllByRole('button')
  expect(buttons.length).toBe(4)
});

it('test click in stories', () => {
  render(<FourStops {...FourStops.args} onClick={clickFunction} />);
  const buttons = screen.getAllByRole('button')
  fireEvent.click(buttons[2])
  expect(clickFunction).toBeCalled()
});
