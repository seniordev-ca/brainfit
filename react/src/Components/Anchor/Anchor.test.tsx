import React from 'react';
import { render, screen } from '@testing-library/react';
import { Anchor } from './Anchor';

test('renders Anchor', () => {
  render(<Anchor href="#" label="Anchor label" />);
  const text = screen.getByText(/Anchor label/i);
  expect(text).toBeInTheDocument();
});
