import React from 'react';
import { Loader } from './Loader';
import { render, screen } from '@testing-library/react';

describe('Loader unit tests', () => {
  test('renders loading', () => {
    render(
      <Loader show={true}/>
    );
    const text = screen.getByText(/Loading/i);
    expect(text).toBeInTheDocument();
  });
})