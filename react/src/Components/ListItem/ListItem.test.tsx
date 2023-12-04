import { render, screen } from '@testing-library/react';
import { ListItem } from './ListItem';

test('renders list item', () => {
  render(<ListItem />);
  const text = screen.getByText('label');
  expect(text).toBeInTheDocument();
});
