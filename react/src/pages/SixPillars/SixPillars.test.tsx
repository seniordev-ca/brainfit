import { SixPillars } from './SixPillars';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store/store';
import { setDataFieldWithID } from 'slices/dataSlice';

jest.mock('@capacitor-community/fcm', () => {

})

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
      getEntries: () => Promise.resolve({
        items: [
          {
            sys: {
              id: 'Pillar ID'
            },
            fields: {
              pillar: 'general',
              title: 'Test content'
            }
          }
        ]
      })
    }
  }
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'), // use actual for all non-hook parts
  useNavigate: () => jest.fn()
}));

describe('SixPillars tests', () => {
  test('renders Six pillars page', () => {
    store.dispatch(setDataFieldWithID({ id: 'sixPillarsFirstRunDone', value: true }))
    render(
      <Provider store={store}>
        <SixPillars />
      </Provider>
    );
    const text = screen.getByText(/Explore/i);
    expect(text).toBeInTheDocument();
  });
})