import React from 'react';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { fireEvent, render, screen } from '@testing-library/react';
import { setDataFieldWithID } from 'slices/dataSlice';
import { TrackingPillar } from './TrackingPillar';
import moment from 'moment';

const mockNow = moment();
jest.mock('helpers/stateHelper', () => ({
  ...jest.requireActual('helpers/stateHelper'),
  useDates: () => ({
    dates: {
      start: mockNow,
      end: mockNow,
      selected: mockNow
    },
    setDates: jest.fn()
  })
}));

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () => Promise.resolve(data)
    }
  }
}));

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => ({ currentUser: null })
}));

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

const auth = {
  currentUser: null
}

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => auth
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
    }
  ]
}

describe('TrackingPillar tests', () => {

  test('Renders page', () => {
    store.dispatch(setDataFieldWithID({ id: 'currentPillar', value: 'exercise' }));
    render(
      <Provider store={store}>
        <TrackingPillar />
      </Provider>
    );

    const text = screen.getByText(/Start new habits to optimize brain health/i);
    expect(text).toBeInTheDocument();
  });

  test('Successfully clicks moreideas button', () => {
    store.dispatch(setDataFieldWithID({ id: 'currentPillar', value: 'exercise' }));

    render(
      <Provider store={store}>
        <TrackingPillar />
      </Provider>
    );

    const text = screen.getByText(/More ideas/i);
    fireEvent.click(text);
    expect(mockNavigate).toHaveBeenCalledWith('/trackingIdeas');

  })
})