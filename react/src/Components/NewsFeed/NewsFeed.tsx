import {
  CardArticle,
  CardArticleProps
} from 'Components/CardArticle/CardArticle';

interface NewsFeedProps {
  newsFeedKey?: string;
  newsFeedClass?: string;
  newsFeedCardClass?: string;
  newsFeedItems: CardArticleProps[];
}

export const NewsFeed = ({
  newsFeedClass = '',
  newsFeedCardClass = '',
  newsFeedItems = [],
  newsFeedKey = 'newsFeedCard'
}: NewsFeedProps) => {
  return (
    <div className={['news-feed', newsFeedClass].join(' ')}>
      {newsFeedItems.map((item: CardArticleProps, i: number) => {
        return (
          <div className={newsFeedCardClass} key={`${i}-${item.articleTitle}`}>
            <CardArticle
              articleTitle={item.articleTitle}
              articlePillar={item.articlePillar}
              articleImg={item.articleImg}
              onClick={item.onClick}
              articleDate={item.articleDate}
              articleHabits={item.articleHabits}
            />
          </div>
        );
      })}
    </div>
  );
};
