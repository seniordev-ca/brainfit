import {
  addNotificationToState,
  calculateWhichCycle,
  databaseSatisfactionsToSavedSatisfactions,
  statsInformation,
  trendsInformation
} from 'helpers/utils';
import NetworkHelper from 'helpers/web/networkHelper';
import moment from 'moment';
import { ChallengeEndedBottomSheet } from 'pages/Partials/ChallengeEndedBottomSheet';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import {
  ActivityContainer,
  Award,
  Challenge,
  DatabaseAward,
  DatabaseSavedChallenge,
  DatabaseSavedSatisfactions,
  NotificationItem,
  SavedDates,
  SavedSatisfactions,
  Stats,
  Trends
} from 'types/types';

import { SyncHelper } from 'helpers/syncHelper';
import { Activity } from 'models/activity';
import { Habit } from 'models/habit';
import { habitAwards } from '../awards/awards';
import { useSelector } from 'react-redux';
import { getData } from 'slices/dataSlice';

// Will be returning to revamp this file.

type UseChallengesType = ReturnType<typeof useChallenges>;
type UseUserHabitsType = ReturnType<typeof useUserHabits>;
type UseSatisfactionsType = ReturnType<typeof useSatisfactions>;
type UseDatesType = ReturnType<typeof useDates>;

type UseStatsType = ReturnType<typeof useStats>;
type UseAwardsType = ReturnType<typeof useAwards>;

type StateHelperContextType = {
  challenges: UseChallengesType;
  satisfactions: UseSatisfactionsType;
  userHabits: UseUserHabitsType;
  stats: UseStatsType;
  dates: UseDatesType;
  awards: UseAwardsType;
};

export const StateHelperContext = createContext<StateHelperContextType>({
  challenges: {} as UseChallengesType,
  userHabits: {} as UseUserHabitsType,
  stats: {} as UseStatsType,
  satisfactions: {} as UseSatisfactionsType,
  dates: {} as UseDatesType,
  awards: {} as UseAwardsType
});

// Because [] !== []
const noHabits: Habit[] = [];

export function StateHelperContextProvider({
  children
}: {
  children: React.ReactNode;
}) {
  // That way we only call these once.

  const stats = useStats();
  const userHabits = useUserHabits();
  const challenges = useChallenges();
  const satisfactions = useSatisfactions();
  const dates = useDates();
  const awards = useAwards();
  const { failed, completed } = challenges;

  const [remindersSet, setRemindersSet] = useState(false);

  const { data } = useSelector(getData);

  // Schedule the notifications
  useEffect(() => {
    if (!remindersSet && userHabits.habits) {
      SyncHelper.scheduleNotifications(userHabits.habits);
      setRemindersSet(true);
    }
  }, [userHabits.habits, remindersSet]);

  useEffect(() => {
    console.log('Rerender entire tree!');
  }, [userHabits]);

  const finishedLoading = !(
    userHabits.loading ||
    challenges.loading ||
    satisfactions.loading ||
    !data.storeLoaded
  );

  return (
    <>
      <StateHelperContext.Provider
        value={{
          stats,
          userHabits,

          challenges,
          satisfactions,
          dates,
          awards
        }}
      >
        {/* Put the splash cover here because we need to load data from the server */}
        {!finishedLoading && <div className="splash-cover"></div>}

        {children}

        {failed?.length > 0 ? (
          <ChallengeEndedBottomSheet
            challenge={failed[0]}
            open={true}
            setOpen={() => {}}
            success={false}
          />
        ) : (
          <></>
        )}
        {completed?.length > 0 ? (
          <ChallengeEndedBottomSheet
            challenge={completed[0]}
            open={true}
            setOpen={() => {}}
            success={true}
          />
        ) : (
          <></>
        )}
      </StateHelperContext.Provider>
    </>
  );
}

export function useAwards() {
  const { data, error, mutate } = useSWR<Award[]>(awardsKey, awardsFetcher);
  const { habits } = useUserHabits();
  const stats = useStats();

  const { challenges } = useChallenges();

  const awardsNotEarned = useMemo(() => {
    if (!data) {
      return habitAwards;
    }

    const earnedIds = data.map((d) => d.id);

    return habitAwards.filter((a) => !earnedIds.includes(a.id));
  }, [data]);

  useEffect(() => {
    const completed: Award[] = [];
    for (let i = 0; i < awardsNotEarned.length; i += 1) {
      const a = awardsNotEarned[i];

      if (
        a.isComplete({
          stats,
          habits,
          challenges
        })
      ) {
        a.dateEarned = Date.now();
        // We will now go ahead and say which ones we completed!
        completed.push(a);
      }
    }
    // What did we add?
    if (completed.length) {
      mutate(
        (data) => {
          let out = data || [];
          out = [...out, ...completed];
          return out;
        },
        {
          revalidate: false
        }
      );
      for (let i = 0; i < completed.length; i += 1) {
        NetworkHelper.claimAward(completed[i]);
        const notification: NotificationItem = {
          id: completed[i].id,
          title: completed[i].title,
          subtitle: completed[i].description,
          notify: false
        };
        addNotificationToState(notification);
      }
    }
  }, [stats, habits, challenges, awardsNotEarned, mutate]);
  return useMemo(
    () => ({
      awards: data || [],
      awardsNotEarned,
      loading: !error && !data
    }),
    [data, error, awardsNotEarned]
  );
}

export function useChallenges() {
  const { habits } = useUserHabits();
  const { data, error } = useSWRImmutable<Challenge[]>(
    challengesKey,
    challengeFetcher
  );

  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    if (data && habits?.length) {
      setChallenges(
        data.map((d) => {
          return {
            ...d,
            progress: challengeCompletion(d),
            challengeHabits: habits?.filter((h) => h.challengeID === d.id)
          };
        })
      );
    }
  }, [data, habits]);

  const [failed, setFailed] = useState<Challenge[]>([]);
  const [completed, setCompleted] = useState<Challenge[]>([]);

  useEffect(() => {
    setFailed(
      challenges.filter(
        (c) => c.active && Date.now() >= c.endDate && c.progress < 100
      )
    );
    setCompleted(
      challenges.filter(
        (c) => c.active && Date.now() >= c.endDate && c.progress >= 100
      )
    );
  }, [challenges]);

  const acknowledgeFailed = useCallback(
    (id: string) => {
      const idx = failed.findIndex((c) => c.id === id);
      if (idx !== -1) {
        failed.splice(idx);
        setFailed([...failed]);
      }
    },
    [setFailed, failed]
  );

  const acknowledgeCompleted = useCallback(
    (id: string) => {
      const idx = completed.findIndex((c) => c.id === id);
      if (idx !== -1) {
        completed.splice(idx);
        setCompleted([...completed]);
      }
    },
    [setCompleted, completed]
  );

  return useMemo(
    () => ({
      challenges: challenges,

      loading: !data && !error,
      error: error,
      completed,
      failed,
      acknowledgeFailed,
      acknowledgeCompleted
    }),
    [
      data,
      error,
      challenges,
      completed,
      failed,
      acknowledgeCompleted,
      acknowledgeFailed
    ]
  );
}

const emptyActContainer: ActivityContainer = {};

function useActivities() {
  const { data, error } = useSWRImmutable<ActivityContainer>(
    activitiesKey,
    activitesFetcher
  );

  const [activities, setActivities] =
    useState<ActivityContainer>(emptyActContainer);

  useEffect(() => {
    if (data && Object.keys(data).length) {
      setActivities(data);
    } else {
      setActivities(emptyActContainer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return useMemo(
    () => ({
      activities,
      loading: !data && !error,
      error: error
    }),
    [data, error, activities]
  );
}

const noStats = {
  averageCompletion: 0,
  longestStreak: 0,
  currentStreak: 0,
  totalCompleted: 0,
  trends: {
    better: [],
    neutral: [],
    worse: []
  }
};

function useStats() {
  const { habits: allHabits } = useUserHabits();

  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (allHabits?.length) {
      setHabits(allHabits.filter((h) => h.status === 'Active'));
    } else {
      setHabits(noHabits);
    }
  }, [allHabits]);

  const [stats, setStats] = useState<Stats>({
    completion: noStats,
    trends: noStats.trends
  });

  useEffect(() => {
    if (!habits?.length) {
      const trends: Trends = {
        better: [],
        worse: [],
        neutral: []
      };
      [
        'Exercise',
        'Sleep',
        'Nutrition',
        'Stress Management',
        'Mental Stimulation',
        'Social Activity'
      ].forEach((pillar: string) => {
        trends.neutral.push({
          pillar: pillar,
          direction: 'neutral',
          change: 0
        });
      });
      const stats = statsInformation([]);

      setStats({
        completion: stats,
        trends
      });
    } else {
      const stats = statsInformation(habits);
      const trends = trendsInformation(habits);

      console.log('Stat trends', trends);
      setStats({
        completion: stats,
        trends
      });
    }
  }, [habits]);
  return stats;
}

export function useUserHabits() {
  const { data, error } = useSWR<Habit[]>(habitsKey, habitsFetcher);
  const { activities, loading: actsLoading } = useActivities();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const current = loading;

    const next = (!error && !data) || actsLoading;
    if (current !== next) {
      setLoading(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, actsLoading, data]);

  useEffect(() => {
    console.log('Loading changed');
  }, [loading]);

  useEffect(() => {
    console.log('Activities!');
  }, [activities]);

  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const go = async () => {
      if (data) {
        const input = await data;
        if (activities && !actsLoading) {
          let out = [...input];

          for (let i = 0; i < data.length; i += 1) {
            const habit = out[i];
            const acts = Object.values(activities[habit.id] || {});

            for (let j = 0; j < acts.length; j += 1) {
              const act = acts[j];

              const cycle = calculateWhichCycle({
                start: habit.startDate,
                frequency: habit.frequencyUnit,
                frequencyCount: habit.frequencyUnitQuantity,
                target: act.actDate
              });

              if (cycle >= 1) {
                habit.activities[cycle - 1] = act;
              }
            }
            out[i] = habit;
          }
          setHabits(out);
        } else {
          setHabits(data.map((d) => Habit.create(d)));
        }
      }
    };
    go();
    // setHabits isn't guaranteed to be stable, and we don't want that to trigger an infinite loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, activities, actsLoading]);

  return useMemo(
    () => ({
      habits: habits,
      loading: loading,
      error: error
    }),
    [habits, error, loading]
  );
}

function useSatisfactions() {
  const { data, error, mutate } = useSWR<SavedSatisfactions[]>(
    satisfactionsKey,
    satisfactionsFetcher
  );

  const put = useCallback(
    (satisfactions: SavedSatisfactions) => {
      mutate(
        (data) => {
          let out = data || [];
          out = [...out, satisfactions];

          return out;
        },
        { revalidate: false }
      );
    },
    [mutate]
  );
  return useMemo(
    () => ({
      satisfactions: data || [],
      loading: !error && !data,
      error: error,
      putSatisfactions: put,
      mutate: mutate
    }),
    [mutate, data, error, put]
  );
}

export function useDates() {
  const [dates, setDates] = useState<SavedDates>({
    start: moment().startOf('week'),
    end: moment().endOf('week'),
    selected: moment()
  });

  const setToToday = useCallback(() => {
    setDates({
      start: moment().startOf('week'),
      end: moment().endOf('week'),
      selected: moment()
    });
  }, []);

  return useMemo(
    () => ({
      dates,
      setDates,
      setToToday
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dates, setDates]
  );
}

const challengeFetcher = async () => {
  const dbs = await NetworkHelper.getChallenges();

  if (!dbs) {
    return [];
  }

  return dbs.map((c: DatabaseSavedChallenge): Challenge => {
    return {
      active: c.Active,
      description: c.Description,
      subtitle: c.Subtitle,
      headerImage: c.HeaderImage,
      darkModeHeaderImage: c.DarkModeHeaderImage,
      endDate: c.EndDate,
      challengeHabits: [],
      duration: c.Duration,
      frequency: c.Frequency,
      id: c.ID,
      important: c.Important,
      pillar: c.Pillar,
      progress: 0,
      startDate: c.StartDate,
      title: c.Title
    };
  });
};

const awardsFetcher = () =>
  NetworkHelper.getAwards().then((r) =>
    r?.map((a: DatabaseAward) => ({
      id: a.ID,
      title: a.Title,
      description: a.Description,
      dateEarned: a.DateEarned,
      challengeId: a.ChallengeID
    }))
  );

const habitsFetcher = () =>
  NetworkHelper.getHabitsByPillar('', true).then((r) =>
    r?.map(Habit.createFromDatabaseHabit)
  );

const satisfactionsFetcher = () =>
  NetworkHelper.getAllSatisfactions().then(
    (r: DatabaseSavedSatisfactions[]) => {
      const satis = r.map(databaseSatisfactionsToSavedSatisfactions);
      const out: {
        [day: number]: SavedSatisfactions;
      } = {};

      for (let i = 0; i < satis.length; i += 1) {
        const sat = satis[i];
        const date = moment(sat.createdAt).startOf('day').valueOf();
        out[date] = sat;
        // console.log(date.toLocaleString(), '=', sat, 'satis');
      }

      // MIND-642
      // Solution: Just take the latest for that satisfaction's date.
      const arr = Object.values(out) as SavedSatisfactions[];
      arr.sort(
        (a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()
      );
      console.log('The satis', arr);
      return [...arr];
    }
  );

function challengeCompletion(challenge: Challenge) {
  // ok so for faster accessing let's turn this array of activities into a map.

  const acts =
    challenge.challengeHabits.length > 0
      ? challenge.challengeHabits
          .map((h) => h.activities)
          .reduce((a, b) => [...a, ...b])
      : [];

  const map: {
    [cycle: string]: Activity[];
  } = {};

  for (let i = 0; i < acts.length; i += 1) {
    const act = acts[i];
    const key = String(act.cycle);

    map[key] ??= [];
    map[key].push(act);
  }

  const info = {
    start: challenge.startDate,
    end: challenge.endDate,
    target: Date.now(),
    frequency: challenge.frequency,
    frequencyCount: 1
  };

  const curCycle = calculateWhichCycle(info);
  const maxCycles = calculateWhichCycle({
    ...info,
    target: challenge.endDate
  });

  const numHabits = challenge.challengeHabits.length;

  for (let i = 1; i <= Math.min(maxCycles, curCycle); i += 1) {
    const key = String(i);
    const acts = map[key];

    // We didn't make progress on any 1 of the habits for this cycle
    if (!acts || acts.length !== numHabits) {
      return 0;
    }
    for (let j = 0; j < acts.length; j++) {
      const act = acts[j];
      const comp = act.completion;

      // If we're finished and any 1 of these is 0, it's over.
      if (comp < 100) {
        return 0;
      }
    }
  }
  return 100 * (curCycle / maxCycles);
}

/**
 *
 * @returns an {@link ActivityContainer}
 */
const activitesFetcher = async () =>
  NetworkHelper.getLatestActivitesForAllHabits().then((input) => {
    const keys = Object.keys(input);
    const out: ActivityContainer = {};

    for (let i = 0; i < keys.length; i += 1) {
      const habitID = keys[i];

      const actCycles = Object.keys(input[habitID]);
      for (let j = 0; j < actCycles.length; j += 1) {
        const cycle = actCycles[j];

        out[habitID] ??= {};

        out[habitID][cycle] = Activity.createFromDatabaseActivity(
          input[habitID][cycle]
        );
      }
    }
    return out;
  });

export const habitsKey = 'habits';
export const activitiesKey = 'latestActivities';
export const challengesKey = 'challenges';
export const satisfactionsKey = 'satisfactions';
export const awardsKey = 'awards';
