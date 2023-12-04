import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { Explainer } from './Explainer';

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () => Promise.resolve({
        items: [
          {
            sys: {
              id: 'Pillar Explainer ID'
            },
            fields: {
              pillar: 'nutrition',
              title: 'Nutrition Pillar'
            }
          },
          {
            sys: {
              id: 'Pillar Explainer ID2'
            },
            fields: {
              pillar: 'exercise',
              title: 'Exercise Pillar'
            }
          }
        ]
      })
    }
  }
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    pillar: 'exercise'
  }),
}))

describe('Explainer Unit Tests', () => {
  test('renders exercise pillar', async () => {
    render(
      <Provider store={store}>
        <Explainer />
      </Provider>
    );
    await waitFor(() => {
      const text = screen.getByText(/exercise pillar/i);
      expect(text).toBeInTheDocument();
    })

  });
});