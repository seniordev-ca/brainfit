import { render, screen } from '@testing-library/react';
import { CardArticleProps } from 'Components/CardArticle/CardArticle';
import { NewsFeed } from './NewsFeed';

test('renders NewsFeed', () => {
  const newsFeedItems: CardArticleProps[] = [
    {
      articleTitle: "Title",
      articlePillar: "Exercise",
      articleImg: 'https://picsum.photos/700/400'
    }
  ];
  render(<NewsFeed newsFeedItems={newsFeedItems} />);
  const text = screen.getByText(/Title/i);
  expect(text).toBeInTheDocument();
});
