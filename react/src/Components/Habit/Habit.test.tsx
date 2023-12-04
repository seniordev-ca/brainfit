import { fireEvent, render, screen } from '@testing-library/react';
import { Habit } from './Habit';

const clickFunction = jest.fn()

test('renders Habit', () => {
  render(<Habit title="title" onClick={clickFunction} />);
  const text = screen.getByText(/title/i);
  expect(text).toBeInTheDocument();
});

test('renders bolded Habit', () => {
  render(<Habit bolded={true} title="title" onClick={clickFunction} />);
  const text = screen.getByText(/title/i);
  expect(text).toBeInTheDocument();
});

test('renders Habit and trigegrs click', () => {
  render(<Habit title="title" onClick={clickFunction} />);
  const text = screen.getByText(/title/i);
  fireEvent.click(text)
  expect(clickFunction).toBeCalled()
});
