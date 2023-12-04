import { fireEvent, render, screen } from '@testing-library/react';
import { Card } from './Card';

const onClick = jest.fn().mockReturnThis();

test('renders Card', () => {
  render(
    <Card>
      <h1>Title</h1>
    </Card>
  );
  
  const text = screen.getByText(/title/i);
  expect(text).toBeInTheDocument();
});

test('renders Card with children', () => {
  render(
    <Card>
      test child
    </Card>
  );

  const text = screen.getByText(/test child/i);
  expect(text).toBeInTheDocument();
});


test('renders card with onClick property', () => {
  render(
    <Card onClick={onClick} />
  );

  const card = screen.getByTestId('card');
  expect(card).toBeInTheDocument();

  fireEvent.click(card);
  expect(onClick).toBeCalledTimes(1);
});
