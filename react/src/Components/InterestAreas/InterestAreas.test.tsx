import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { InterestAreas } from './InterestAreas';

describe('InterestAreas Unit Tests', () => {
  test('renders InterestAreas', async () => {
    render(
      <Provider store={store}>
        <InterestAreas />
      </Provider>
    );
    const text = screen.getByText(/Select the areas/i);
    expect(text).toBeInTheDocument();
  });
});
