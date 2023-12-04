import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Carousel } from './Carousel';

test('renders Carousel without any items', () => {
  render(<Carousel id="testCarousel" carouselItems={[]} />);

  expect(screen.queryAllByRole('button').length).toEqual(0);
});

test('renders Carousel with items', () => {
  render(<Carousel id="testCarousel" carouselItems={[<></>, <></>, <></>]} />);

  const buttons = screen.queryAllByRole('button');
  expect(buttons.length).toEqual(4);
});

test('navigate carousel forward and backward using controls', async () => {
  const onNext = jest.fn();
  const onPrevious = jest.fn();
  render(<Carousel id="testCarousel" carouselItems={[<>slide 1</>, <>slide 2</>, <>slide 3</>]} onNext={onNext} onPrevious={onPrevious} />);

  const next = screen.getByText(/next/i);
  fireEvent.click(next);
  await waitFor(() => {
    expect(screen.getByText(/slide 2/i)).toBeInTheDocument();
  });
  expect(onNext).toBeCalledTimes(1);

  const previous = screen.getByText(/previous/i);
  fireEvent.click(previous);
  await waitFor(() => {
    expect(screen.getByText(/slide 1/i)).toBeInTheDocument();
  });
  expect(onPrevious).toBeCalledTimes(1);
});

test('navigate using carousel slide indicators', async () => {
  const onNext = jest.fn();
  const onPrevious = jest.fn();
  render(<Carousel id="testCarousel" carouselItems={[<>slide 1</>, <>slide 2</>, <>slide 3</>]} onNext={onNext} onPrevious={onPrevious} />);

  const buttons = screen.queryAllByRole('button');
  fireEvent.click(buttons[buttons.length - 1]);

  await waitFor(() => {
    expect(screen.getByText(/slide 3/i)).toBeInTheDocument();
  })
});
