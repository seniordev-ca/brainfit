import { fireEvent, render, screen } from '@testing-library/react';
import { SegmentedControl } from './SegmentedControl';

const clickFunction = jest.fn()

test('renders SegmentedControl', () => {
  render(<SegmentedControl optionLabels={['Option 1', 'Option 2']} onOptionSelected={clickFunction} />);
  let text = screen.getByText(/Option 1/i);
  expect(text).toBeInTheDocument();
  text = screen.getByText(/Option 2/i);
  expect(text).toBeInTheDocument();
});

test('renders SegmentedControl with 3 options', () => {
  render(<SegmentedControl optionLabels={['Option 1', 'Option 2', 'Option 3']} onOptionSelected={clickFunction} />);
  let text = screen.getByText(/Option 3/i);
  expect(text).toBeInTheDocument();
});

test('renders SegmentedControl with 4 options', () => {
  render(<SegmentedControl optionLabels={['Option 1', 'Option 2', 'Option 3', 'Option 4']} onOptionSelected={clickFunction} />);
  let text = screen.getByText(/Option 4/i);
  expect(text).toBeInTheDocument();
});

test('option click is triggered', () => {
  render(<SegmentedControl optionLabels={['Option 1', 'Option 2', 'Option 3', 'Option 4']} onOptionSelected={clickFunction} />);
  const button = screen.getByText(/Option 4/i);
  fireEvent.click(button)
  expect(clickFunction).toBeCalled()
});