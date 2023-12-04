import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProgressIcon } from './ProgressIcon';

test('renders Progress Icon', () => {
  render(<ProgressIcon progress={50}/>);
  const text = screen.getByText(/50/i);
  expect(text).toBeInTheDocument();
});
