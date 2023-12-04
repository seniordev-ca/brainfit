import { render, screen } from '@testing-library/react';
import { NavTabItem } from './NavTabItem';
import { ReactComponent as todayOff } from '../../img/Nav/today_off.svg';
import { ReactComponent as todayOn } from '../../img/Nav/today_on.svg';


test('renders Habit', () => {
  render(<NavTabItem label='test nav tab item' IconActive={todayOn} IconInactive={todayOff} />);
  const text = screen.getByText(/test nav tab item/i);
  expect(text).toBeInTheDocument();
});

