import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AchievementCard } from './AchievementCard';

describe('AchievementCard unit tests', () => {
  test('renders AchievementCard, check title string', () => {
    render(<AchievementCard
      title='Test Achievement'
      awardID='award-id'
      completed={false}
      onClick={() => { }} />);

    const text = screen.getByText(/Test Achievement/i);
    expect(text).toBeInTheDocument();
  });

  test('onClick gets triggered on click', () => {
    const onClickTest = jest.fn();

    render(<AchievementCard
      title='Test Achievement'
      awardID='award-id'
      completed={false}
      onClick={() => { onClickTest() }} />);

    const card = screen.getByTestId('achievementCardTestID');
    fireEvent.click(card);

    expect(onClickTest).toBeCalled();
  });

  test('complete flag shaows star image', () => {
    render(<AchievementCard
      title='Test Achievement'
      awardID='award-id'
      completed={true}
      onClick={() => { }} />);

    const image = screen.getByRole('img');

    expect(image).toHaveClass('star')
  });

  test('incomplete flag shaows empty star image', () => {
    render(<AchievementCard
      title='Test Achievement'
      awardID='award-id'
      completed={false}
      onClick={() => { }} />);

    const image = screen.getByRole('img');

    expect(image).toHaveClass('incomplete')
  });
})