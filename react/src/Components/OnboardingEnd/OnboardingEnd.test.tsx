import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { OnboardingEnd } from './OnboardingEnd';

describe('OnboardingEnd Unit Tests', () => {
  test('renders OnboardingEnd', async () => {
    render(
      <Provider store={store}>
        <OnboardingEnd />
      </Provider>
    );
    const text = screen.getByText(/new habits/i);
    expect(text).toBeInTheDocument();
  });
});
