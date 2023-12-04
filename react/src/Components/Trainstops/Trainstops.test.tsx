import { fireEvent, render, screen } from '@testing-library/react';
import { Trainstops } from './Trainstops';

const clickFunction = jest.fn()

test('renders Trainstops', () => {
  render(<Trainstops numberOfStops={3} activeStop={0} onClick={clickFunction} />);
  const buttons = screen.getAllByRole('button')
  expect(buttons.length).toBe(3)
});

test('renders Trainstops with 4 stops', () => {
  render(<Trainstops numberOfStops={4} activeStop={0} onClick={clickFunction} />);
  const buttons = screen.getAllByRole('button')
  expect(buttons.length).toBe(4)
});

test('Trainstop click function', () => {
  render(<Trainstops numberOfStops={3} activeStop={2} onClick={clickFunction} />);
  const buttons = screen.getAllByRole('button')
  fireEvent.click(buttons[2])

  expect(clickFunction).toBeCalled()
  expect(buttons[2]).toHaveClass('active')
});