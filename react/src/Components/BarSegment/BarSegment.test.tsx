import { render, screen } from '@testing-library/react';
import { BarSegment } from './BarSegment';

test('renders horizontal BarSegment', () => {
  render(<BarSegment horizontal={true} percentComplete={50} />);
  const container = screen.getByTestId('segment')
  expect(container).toHaveClass('barHorizontal_Container')
});

test('renders vertical BarSegment', () => {
  render(<BarSegment horizontal={false} percentComplete={50} />);
  const container = screen.getByTestId('segment')
  expect(container).toHaveClass('barVertical_Container')
});
