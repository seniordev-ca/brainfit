import React from 'react';
import { Footer } from './Footer';
import { render, screen } from '@testing-library/react';

describe('Footer tests', () => {
  test('renders footer', () => {
    render(
      <Footer />
    );
    const text = screen.getByText(/COMPANY LOGO/i);
    expect(text).toBeInTheDocument();
  });
})