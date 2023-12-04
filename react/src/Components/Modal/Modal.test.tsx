import { render, screen } from '@testing-library/react';
import { Modal } from './Modal';

test('renders Modal', () => {
  render(<Modal showModal={true} title="title" />);
  const text = screen.getByText(/title/i);
  expect(text).toBeInTheDocument();
});


