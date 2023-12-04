// Article.stories.test.tsx

import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/testing-react';

import * as stories from '../Article.stories';

const { DefaultArticle, ArticleNoImage, CustomContent, CustomContentWithHeaderImage } =
  composeStories(stories);

it('renders the default article', () => {
  render(<DefaultArticle {...DefaultArticle.args} title="title"/>);

  const text = screen.getByText('title');
  expect(text).toBeInTheDocument();
});

it('renders the article with no image', () => {
  render(<ArticleNoImage {...ArticleNoImage.args} title="title"/>);

  const text = screen.getByText('title');
  expect(text).toBeInTheDocument();

  const images = screen.queryAllByRole('img');
  expect(images.length).toEqual(0);
});

it('renders the article with custom content', () => {
  render(<CustomContent {...CustomContent.args}/>);

  const text = screen.getByText(/Hello world/i);
  expect(text).toBeInTheDocument();
});

it('renders the article with custom content and header image', () => {
  render(<CustomContentWithHeaderImage title='title' {...CustomContentWithHeaderImage.args} />);

  const text = screen.getByText('title');
  expect(text).toBeInTheDocument();

  const images = screen.queryAllByRole('img');
  expect(images.length).toEqual(1);
});
