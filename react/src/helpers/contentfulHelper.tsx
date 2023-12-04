import * as contentful from 'contentful';
import { Habit } from 'models/habit';
import { useEffect, useMemo, useState } from 'react';

import useSWRImmutable from 'swr/immutable';
import {
  Challenge,
  ChallengeMap,
  ContentfulChallenge,
  ContentfulPost,
  HabitCollection,
  HabitContent
} from 'types/types';
import { useUserHabits } from './stateHelper';
import { cmsChallengeToChallenge, habitPillars } from './utils';

const client = contentful.createClient({
  accessToken:
    process.env.REACT_APP_CONTENTFUL_CONTENT_KEY ||
    'C-st7QP9L5FWx8dXDlN5lnkA1TNoeQyfxXEUBvPZwYY',
  space: 'o4fkde1we0af',
  environment:
    process.env.REACT_APP_CONTENTFUL_CONTENT_ENVIRONMENT || 'development' // defaults to 'master' if not set
});

export function useContentful() {
  return {
    client
  };
}

export function useContentfulCollections() {
  const { data } = useSWRImmutable(
    'contentful:habitCollection',
    collectionsFetcher
  );

  return { collections: data || [] };
}

export function useContentfulHabits() {
  const { data: habits } = useSWRImmutable('contentful:habits', habitsFetcher);

  return {
    habits: habits || []
  };
}

export function useFilteredContentfulHabits() {
  const { habits: contentfulHabits } = useContentfulHabits();
  const { habits: allHabits } = useUserHabits();

  const [out, setOut] = useState<Habit[]>([]);

  useEffect(() => {
    if (contentfulHabits?.length && allHabits?.length) {
      setOut(
        contentfulHabits.filter(
          (ch) => !allHabits?.find((h) => h.cmsLink === ch.id)
        )
      );
    } else if (contentfulHabits?.length) {
      setOut(contentfulHabits);
    }
  }, [contentfulHabits, allHabits]);

  // useEffect(() => {
  //   if (contentfulHabits?.length) {
  //     if (allHabits?.length) {
  //       setOut(
  //         contentfulHabits.filter(
  //           (ch) => !allHabits?.find((h) => h.cmsLink === ch.id)
  //         )
  //       );
  //     } else {
  //       setOut(contentfulHabits);
  //     }
  //   } else {
  //     setOut([]);
  //   }
  // }, [allHabits, contentfulHabits]);

  // useEffect(() => {
  //   if (contentfulHabits?.length) {
  //     const links = new Set(
  //       allHabits?.filter((h) => h.cmsLink).map((h) => h.cmsLink!)
  //     );
  //     setOut(
  //       links.size
  //         ? contentfulHabits.filter(
  //             (ch) => !allHabits?.find((h) => h.cmsLink === ch.id)
  //           )
  //         : contentfulHabits
  //     );

  //     // console.log
  //   } else {
  //     setOut([]);
  //   }
  // }, [contentfulHabits]);

  return {
    habits: out
  };
}

export function useContentfulChallenges() {
  const { data } = useSWRImmutable('contentful:challenges', challengesFetcher);

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengesMap, setChallengeMap] = useState<ChallengeMap>({
    Exercise: [],
    Nutrition: [],
    'Stress Management': [],
    'Social Activity': [],
    Sleep: [],
    'Mental Stimulation': [],
    important: [],
    othersImportant: []
  });
  const { habits: userHabits } = useUserHabits();

  const allChallengeIds = useMemo(
    () => new Set(userHabits?.map((h) => h.challengeID)),
    [userHabits]
  );

  useEffect(() => {
    if (data) {
      let { challengeMap, challengeHabits } = data;
      challengeHabits = challengeHabits.filter(
        (h) => !allChallengeIds.has(h.id)
      );
      challengeMap.important = challengeHabits.filter((h) => h.important);

      habitPillars.forEach((pillar) => {
        challengeMap[pillar] = challengeHabits.filter((h) =>
          h.pillar.includes(pillar)
        );
      });

      setChallenges(challengeHabits);
      setChallengeMap(challengeMap);
    }
  }, [data, allChallengeIds]);
  return { challenges, challengesMap };
}

export function useContentfulFeed() {
  const { data: feed, error } = useSWRImmutable(
    'contentful:posts',
    feedFetcher
  );

  return {
    feed: feed || [],
    loading: !error && !feed
  };
}
async function feedFetcher(): Promise<ContentfulPost[]> {
  return client
    .getEntries<ContentfulPost>({
      content_type: 'post',
      order: '-sys.createdAt'
    })
    .then((data) => {
      return (
        data.items.map((p) => ({
          body: p.fields.body,
          byline: p.fields.byline,
          pillar: p.fields.pillar,
          title: p.fields.title,
          publicationDate: p.fields.publicationDate,
          audioOrVideoAsset: p.fields.audioOrVideoAsset,
          relatedHabits: p.fields.relatedHabits,
          createdAt: new Date(p.sys.createdAt).getTime()
        })) || []
      );
    });
}

async function challengesFetcher() {
  return client
    .getEntries<ContentfulChallenge>({
      content_type: 'challenge'
    })
    .then((data: any) => {
      let challengeHabits: Challenge[] = data.items.map((c: any) =>
        cmsChallengeToChallenge(c)
      );

      const challengeMap: ChallengeMap = {
        Exercise: [],
        Nutrition: [],
        'Stress Management': [],
        'Social Activity': [],
        Sleep: [],
        'Mental Stimulation': [],
        important: [],
        othersImportant: []
      };

      challengeMap.important = challengeHabits.filter((h) => h.important);

      habitPillars.forEach((pillar) => {
        challengeMap[pillar] = challengeHabits.filter((h) =>
          h.pillar.includes(pillar)
        );
      });

      return {
        challengeHabits,
        challengeMap
      };
    });
}

async function collectionsFetcher() {
  return client
    .getEntries<HabitCollection>({
      content_type: 'habitCollection'
    })
    .then((data: any) => {
      let contentfulCollections: contentful.Entry<HabitCollection>[] =
        data.items;
      return contentfulCollections.map((collection) => {
        return {
          title: collection.fields.title,
          habits: collection.fields.habits
            .filter((c) => c.fields)
            .map((c) => Habit.createFromContentfulHabit(c))
        };
      });
    });
}

async function habitsFetcher() {
  return (
    client
      .getEntries<HabitContent>({
        content_type: 'habit'
      })
      .then((data: any) => {
        let contentfulHabits: contentful.Entry<HabitContent>[] = data.items;

        return contentfulHabits.map((h) => Habit.createFromContentfulHabit(h));
      }) || []
  );
}
