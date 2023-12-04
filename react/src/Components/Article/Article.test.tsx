import { render, screen } from '@testing-library/react';
import { Article } from './Article';

test('renders Article', () => {
  render(<Article title="title" />);
  const text = screen.getByText(/title/i);
  expect(text).toBeInTheDocument();
});