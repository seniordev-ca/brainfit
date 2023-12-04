import { Capacitor } from '@capacitor/core';
import { Loader } from 'Components/Loader/Loader';
import { NewsFeed } from 'Components/NewsFeed/NewsFeed';
import { useContentfulFeed } from 'helpers/contentfulHelper';
import { isHabitPillar, processContentfulAssetURL } from 'helpers/utils';
import _ from 'lodash';
import moment from 'moment';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { ContentfulPost, HabitPillarFilter } from 'types/types';

interface ExploreContentProps {
  selectedPillar?: Exclude<HabitPillarFilter, 'archived'>;
  query?: string;
  newsFeedKey?: string;
  hide?: boolean;
  onArticleClicked?: (article: ContentfulPost) => void;
}

export const ExploreContent = ({
  query = '',
  selectedPillar = 'all',
  newsFeedKey = 'pillarsNewsFeed',
  hide,
  onArticleClicked
}: ExploreContentProps): ReactElement => {
  const platform = Capacitor.getPlatform();
  const { feed, loading } = useContentfulFeed();

  const [items, setItems] = useState<ContentfulPost[]>(feed || []);

  // Should this debounce only apply for the query?
  const filterSetItems = useCallback(
    (query: string, out: ContentfulPost[]) =>
      _.debounce((query: string, out: ContentfulPost[]) => {
        const trimmedQuery = query.trim();

        if (trimmedQuery) {
          const r = new RegExp(trimmedQuery, 'i');
          out = out.filter((p) => r.test(p.title) || r.test(p.pillar));
        }
        setItems(out);
      }, 200)(query, out),
    []
  );

  useEffect(() => {
    if (feed?.length) {
      let out = feed;
      // Pillar filter
      out = hide
        ? []
        : feed.filter((p) =>
          isHabitPillar(selectedPillar) ? p.pillar === selectedPillar : p
        );

      filterSetItems(query, out);
    }
  }, [feed, query, selectedPillar, filterSetItems, hide]);

  return (
    <div>
      {loading ? <Loader full={true} hideText={true} show={loading} /> : ''}
      {/* MIND-688 */}
      {items.length > 0 && !hide ? (
        <div>
          <NewsFeed
            newsFeedClass={'mt-8'}
            newsFeedCardClass={platform === 'web' ? 'self-start mb-4' : 'mb-4'}
            newsFeedKey={newsFeedKey}
            newsFeedItems={items.map((i) => ({
              articleDate: moment(i.createdAt).format('MMMM D'),
              articleTitle: i.title,
              articlePillar: i.pillar,
              articleHabits:
                i.relatedHabits?.length > 0
                  ? `Includes ${i.relatedHabits.length} ${i.relatedHabits.length === 1 ? 'habit' : 'habits'}`
                  : '',
              articleImg: i.audioOrVideoAsset
                ? processContentfulAssetURL(
                  i.audioOrVideoAsset.fields?.file?.url
                )
                : undefined,

              onClick: () => onArticleClicked && onArticleClicked(i)
            }))}
          />
          <br />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
