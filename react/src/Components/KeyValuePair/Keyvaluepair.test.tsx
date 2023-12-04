import React from 'react';
import { render, screen } from '@testing-library/react';
import { KeyValue } from './Keyvaluepair';

test('renders KeyValue, check label', () => {
  render(<KeyValue kvpKey="Test Key" kvpValue="Test Value" />);
  const text = screen.getByText(/Test Key/i);
  expect(text).toBeInTheDocument();
});

test('renders KeyValue, check value', () => {
  render(<KeyValue kvpKey="Test Key" kvpValue="Test Value" />);
  const text = screen.getByText(/Test Value/i);
  expect(text).toBeInTheDocument();
});
