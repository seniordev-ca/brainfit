import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { DurationPicker } from './DurationPicker';

jest.mock('@capacitor-community/fcm', () => {

})

jest.mock('contentful', () => ({
  ...jest.requireActual('contentful'), // use actual for all non-hook parts
  createClient: () => {
    return {
    }
  }
}));

test('renders TimeSpinner', () => {
  render(<Router><DurationPicker /></Router>);
  const text = screen.queryAllByText('40 hr');
  expect(text.length).toEqual(2);
});
