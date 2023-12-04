import React from 'react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { render, screen, waitFor } from '@testing-library/react';
import { setDataFieldWithID } from 'slices/dataSlice';
import { Activity } from './Activity';

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () => Promise.resolve(data)
    }
  }
}));

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

const data = {
  items: [
    {
      fields: {
        title: 'Gym instead of netflix',
        pillar: 'exercise'
      },
      sys: {
        id: 'testID'
      }
    }
  ]
}

describe('Activity tests', () => {
  test('Renders page', async () => {
    store.dispatch(setDataFieldWithID({ id: 'currentPillar', value: 'exercise' }));
    store.dispatch(setDataFieldWithID({ id: 'currentActivity', value: 'Gym instead of netflix' }))
    render(
      <Provider store={store}>
        <Activity />
      </Provider>
    )

    await waitFor(() => {
      const text = screen.getByText(/Create habit/i);
      expect(text).toBeInTheDocument();
    })
  })

  test('Renders correct page content', async () => {
    store.dispatch(setDataFieldWithID({ id: 'currentPillar', value: 'exercise' }));
    store.dispatch(setDataFieldWithID({ id: 'currentActivity', value: 'Gym instead of netflix' }))
    render(
      <Provider store={store}>
        <Activity />
      </Provider>
    )

    await waitFor(() => {
      const text = screen.getByText(/Gym instead of netflix/i);
      expect(text).toBeInTheDocument();
    })
  })
})