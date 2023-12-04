import React from 'react';
import { render, screen } from '@testing-library/react';
import { Dropdown } from './Dropdown';

test('renders Button', () => {
  render(<Dropdown showDropdown={false} dropdownOnClick={() => { }} dropdownItems={[{ label: 'dropdown item 1' }]} label="label" />);
  const text = screen.getByText(/label/i);
  expect(text).toBeInTheDocument();
});
