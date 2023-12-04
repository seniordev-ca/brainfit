import React from 'react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { render, screen, waitFor } from '@testing-library/react';
import { setDataFieldWithID } from 'slices/dataSlice';
import { TrackingIdeas } from './TrackingIdeas';
import NetworkHelper from 'helpers/web/networkHelper';

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () => Promise.resolve(data)
    };
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
        title: 'test Title',
        pillar: 'exercise'
      },
      sys: {
        id: 'testID'
      }
    },
    {
      fields: {
        title: 'Super pillar',
        pillar: 'sleep exercise'
      },
      sys: {
        id: 'testID2'
      }
    }
  ]
};

const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => mockAuth
}));

describe('TrackingIdeas tests', () => {
  test('Renders page', () => {
    store.dispatch(
      setDataFieldWithID({ id: 'currentPillar', value: 'exercise' })
    );
    render(
      <Provider store={store}>
        <TrackingIdeas />
      </Provider>
    );

    const text = screen.getByText(/Start new habits to optimize brain health/i);
    expect(text).toBeInTheDocument();
  });

  test('Renders contentful content', async () => {
    store.dispatch(
      setDataFieldWithID({ id: 'currentPillar', value: 'exercise' })
    );
    NetworkHelper.getHabitsByPillar = jest.fn().mockImplementation(() => {
      return [];
    });

    render(
      <Provider store={store}>
        <TrackingIdeas />
      </Provider>
    );

    await waitFor(() => {
      const text = screen.getByText(/test Title/i);
      expect(text).toBeInTheDocument();
    });
  });

  test('Renders a super habit', async () => {
    store.dispatch(
      setDataFieldWithID({ id: 'currentPillar', value: 'exercise' })
    );
    NetworkHelper.getHabitsByPillar = jest.fn().mockImplementation(() => {
      return [];
    });

    render(
      <Provider store={store}>
        <TrackingIdeas />
      </Provider>
    );

    await waitFor(() => {
      const text = screen.getByText(/Super pillar/i);
      expect(text).toBeInTheDocument();
    });
  });
});
