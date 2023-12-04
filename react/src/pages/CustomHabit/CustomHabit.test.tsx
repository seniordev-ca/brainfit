import { Provider } from 'react-redux';
import store from '../../store/store';
import { fireEvent, render, screen } from '@testing-library/react';
import { setDataFieldWithID } from 'slices/dataSlice';
import { CustomHabit } from './CustomHabit';
import NetworkHelper from 'helpers/web/networkHelper';

const mockNavigate = jest.fn();

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => mockNavigate
}));

const mockAuth = {
  currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
  onAuthStateChanged: jest.fn()
};

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => mockAuth
}));

describe('CustomHabit tests', () => {
  test('Renders page', () => {
    render(
      <Provider store={store}>
        <CustomHabit />
      </Provider>
    );

    const text = screen.getByText(/Label/i);
    expect(text).toBeInTheDocument();
  });

  test('Failure onClick (no time value)', () => {
    store.dispatch(
      setDataFieldWithID({ id: 'currentPillar', value: 'exercise' })
    );
    render(
      <Provider store={store}>
        <CustomHabit />
      </Provider>
    );

    const submit = screen.getByText('Create habit');
    fireEvent.click(submit);

    const text = screen.getByText('Please enter time value');
    expect(text).toBeInTheDocument();
  });

  test('Successful onClick', () => {
    store.dispatch(
      setDataFieldWithID({ id: 'currentPillar', value: 'exercise' })
    );
    NetworkHelper.scheduleHabit = jest.fn().mockImplementation(() => {
      return true;
    });
    render(
      <Provider store={store}>
        <CustomHabit />
      </Provider>
    );

    const time = screen.getByTestId('time');
    fireEvent.change(time, { target: { value: '18:42' } });

    const label = screen.getByTestId('name');
    fireEvent.change(label, { target: { value: 'Test' } });

    const submit = screen.getByText('Create habit');
    fireEvent.click(submit);

    expect(mockNavigate).toHaveBeenCalledWith('/trackingPillar');
  });
});
