import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { TimeSpinner } from './TimeSpinner';

test('renders TimeSpinner', () => {
  render(<Router><TimeSpinner /></Router>);
  const text = screen.queryAllByText('59');
  expect(text.length).toEqual(4);
});
