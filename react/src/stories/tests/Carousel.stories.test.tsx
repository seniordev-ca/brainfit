/* eslint-disable testing-library/prefer-screen-queries */
// Carousel.stories.test.tsx

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Carousel.stories';

const { DefaultCarousel, CustomClass, WithImages, MoreHTML } =
  composeStories(stories);

it('renders the default carousel', async () => {
  render(<DefaultCarousel {...DefaultCarousel.args} />);

  await waitFor(() => {
    const text = screen.getByText(/tip 1/i);
    expect(text).toBeInTheDocument();
  });
});

it('renders the carousel with custom class', async () => {
  
  const { container } = render(<CustomClass {...CustomClass.args}/>);

  await waitFor(() => {
    const text = screen.getByText(/tip 2/i);
    expect(text).toBeInTheDocument();
  });

  await waitFor(() => {
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.getElementsByClassName('w-1/4').length).toBe(1);
  });
  
});

it('renders the carousel containing 2 images', async () => {
  render(<WithImages {...WithImages.args} />);

  await waitFor(() => {
    const text = screen.getByText(/Sample image/i);
    expect(text).toBeInTheDocument();
  });

  await waitFor(() => {
    const image = screen.queryAllByRole('img');
    expect(image.length).toEqual(2);
  })
});

it('renders the carousel with more HTML', async () => {
  const { container } = render(<MoreHTML {...MoreHTML.args}/>);

  await waitFor(() => {
    const text = screen.getByText(/Onboarding/i);
    expect(text).toBeInTheDocument();
  });

  await waitFor(() => {
    const image = screen.queryAllByRole('img');
    expect(image.length).toEqual(2);
  });

  await waitFor(() => {
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.getElementsByClassName('w-1/4').length).toBe(1);
  });
});

