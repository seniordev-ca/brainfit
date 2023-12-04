import { CommonContext } from 'contexts/common.context';
import { CustomHabitContext } from 'contexts/customhabit.context';
import localization from 'helpers/localizationHelper';
import {
  useAwards,
  useChallenges,
  useSatisfactions,
  useStats,
  useUserHabits
} from 'helpers/stateHelper';
import {
  challengeIconFrame,
  challengeToAward,
  isHabitPillar,
  isToday,
  statsInformation
} from 'helpers/utils';
import moment from 'moment';
import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import {
  Award,
  Challenge,
  DialogProps,
  HabitFrequency,
  HabitPillar,
  HabitPillarFilter
} from 'types/types';

import { ChallengeDetailsSheet } from 'pages/Partials/ChallengeDetailsSheet';

import { Button } from 'Components/Button/Button';
import { CardHabitStats } from 'Components/CardHabitStats/CardHabitStats';
import { GoalsCluster } from 'Components/GoalsCluster/GoalsCluster';
import { ListGroup } from 'Components/ListGroup/ListGroup';
import { ListItem } from 'Components/ListItem/ListItem';
import { SegmentedControl } from 'Components/SegmentedControl/SegmentedControl';
import { SpiderGraphWithSlider } from 'Components/SpiderGraphWithSlider/SpiderGraphWithSlider';
import { StatTile } from 'Components/StatTile/StatTile';
import { Trend, TrendProps } from 'Components/Trend/Trend';
import { Typography } from 'Components/Typography/Typography';

import { ReactComponent as CompletionIcon } from '../../img/icon_stats_completion.svg';
import { ReactComponent as TotalIcon } from '../../img/icon_stats_total.svg';

import { ReactComponent as BrainIcon } from 'img/home_last_logo.svg';

import { CardChallenge } from 'Components/CardChallenge/CardChallenge';
import './Tracking.scss';

import { ReactComponent as AwardSVG } from 'img/icon_award.svg';
import { ReactComponent as AwardTrophy } from 'img/icon_award_trophy.svg';
import { ReactComponent as Share } from '../../img/icon_share.svg';

import { Card } from 'Components/Card/Card';
import { PillarFilter } from 'Components/PillarFilter/PillarFilter';
import { StatsChartWithHistory } from 'Components/StatsChartWithHistory/StatsChartWithHistory';
import _ from 'lodash';
import { Habit } from 'models/habit';
import { useDispatch, useSelector } from 'react-redux';
import { getData, setDataFieldWithID } from 'slices/dataSlice';

type PillarTrend = TrendProps & {
  change: number;
};

function CardAward({ award }: { award: Award }) {
  const isEarned = award.dateEarned > 0;
  const Image = () =>
    !award.challengeId ? (
      <div className={'w-14 h-14'}>
        <AwardSVG className={'!h-14 !w-14'} />
      </div>
    ) : (
      <div>
        <div
          className={
            'flex content-center items-center justify-center w-20 h-20 mr-2 rounded-lg bg-mom_lightMode_surface-dimmed dark:bg-mom_darkMode_surface-dimmed'
          }
        >
          <BrainIcon className={'relative w-14 h-14 -right-3.5'} />
          <AwardTrophy className={'relative w-8 h-8 top-7 -right-3'} />
        </div>
      </div>
    );

  return (
    <Card
      cardType="card-notactionable"
      cardClass={[...(!isEarned ? ['opacity-50'] : ['']), 'text-left']}
    >
      <div className={'flex items-center text-left'}>
        <Image />
        <div>
          <Typography content={award.title} usage="headingSmall" />
          <Typography
            content={isEarned ? award.description : award.unearnedDescription}
            usage="captionRegular"
          />
        </div>
        {isEarned ? (
          <div
            className={'w-6 h-6 float-right text-right flex justify-end flex-1'}
          >
            <Share className={'!w-6 !h-6 share_label'} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </Card>
  );
}

function TrendCard({ trends }: { trends: PillarTrend[] }) {
  const Items = trends.map((t) => (
    <ListItem
      label={
        <Trend
          key={`TC-${t.direction}-${t.pillar}-${t.change}`}
          direction={t.direction}
          change={t.change}
          incomplete={t.incomplete}
          pillar={t.pillar}
          notApplicable={t.notApplicable}
        />
      }
    />
  ));
  return <ListGroup items={Items} listGroupType="listGroup_secondary" />;
}

function GoalsView({ onClose }: { onClose: () => void }) {
  const { habits: allHabits } = useUserHabits();

  const [pillarFilter, setPillarFilter] = useState<HabitPillarFilter>('all');

  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (allHabits?.length) {
      if (isHabitPillar(pillarFilter)) {
        setHabits(
          allHabits.filter(
            (h) => h.status !== 'Archived' && h.pillars.includes(pillarFilter)
          )
        );
      } else if (pillarFilter === 'archived') {
        setHabits(allHabits.filter((h) => h.status === 'Archived'));
      } else {
        setHabits(allHabits.filter((h) => h.status !== 'Archived'));
      }
    } else {
      setHabits([]);
    }
  }, [allHabits, pillarFilter]);

  // const [pillarActivities, setPillarActivities] = useState<Activity[]>([]);

  // useEffect(() => {
  //   const habitActs = habits.map((h) => h.activities);
  //   if (habitActs?.length) {
  //     console.log('Comp habits', habits);
  //     setPillarActivities(habitActs.reduce((a, b) => [...a, ...b]));
  //   } else {
  //     setPillarActivities([]);
  //   }
  // }, [habits]);

  function habitsWithAverage(f: HabitFrequency) {
    const theHabits = habits.filter((h) => h.frequencyUnit === f);

    if (!theHabits.length) {
      return { habits: [], average: 0 };
    }

    const acts = theHabits.length
      ? theHabits.map((h) => h.activities).reduce((a, b) => [...a, ...b])
      : [];

    const average = acts.length
      ? Math.round(
          acts.map((a) => a.completion).reduce((a, b) => a + b) / acts.length
        )
      : 0;

    return { habits: theHabits, average };
  }

  const [stats, setStats] = useState({
    averageCompletion: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCompleted: 0
  });

  useEffect(() => {
    if (habits) {
      setStats(statsInformation(habits));
    } else {
      setStats({
        averageCompletion: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalCompleted: 0
      });
    }
  }, [habits]);

  const dailyActsAvg = habitsWithAverage('day');
  const weeklyActsAvg = habitsWithAverage('week');
  const monthlyActsAvg = habitsWithAverage('month');

  function ChartAndAverage(
    title: string,
    frequency: HabitFrequency,
    { habits, average }: ReturnType<typeof habitsWithAverage>
  ) {
    if (!habits.length) {
      return <></>;
    }

    return (
      <div className={'mb-6'}>
        <div className={'justify-between flex mb-4'}>
          <Typography usage="headingMedium" content={title} />
          <span>
            <Typography
              usage="captionMedium"
              typeClass={['inline']}
              content="avg. "
            />
            <Typography
              usage="headingSmall"
              content={`${average}%`}
              typeClass={['inline']}
            />
          </span>
        </div>
        <StatsChartWithHistory
          habits={habits}
          colour={isHabitPillar(pillarFilter) ? pillarFilter : 'default'}
          frequency={frequency}
        />
      </div>
    );
  }

  const Daily = () => ChartAndAverage('Daily Goals', 'day', dailyActsAvg);
  const Weekly = () => ChartAndAverage('Weekly Goals', 'week', weeklyActsAvg);
  const Monthly = () =>
    ChartAndAverage('Monthly Goals', 'month', monthlyActsAvg);

  return (
    <div className={'flex flex-col flex-1'}>
      <div className="grid grid-cols-3 mb-4">
        <Typography
          typeClass={[
            'text-mom_lightMode_text-primary dark:text-mom_darkMode_text-primary',
            'text-left'
          ]}
          usage="body"
          content="Back"
          onClick={onClose}
        />
        <Typography
          typeClass={[
            'text-mom_lightMode_text-neutral dark:text-mom_darkMode_text-neutral '
          ]}
          usage="headingSmall"
          content="Goals"
        />
      </div>

      <div className={'mb-6'}>
        <PillarFilter onPillarChanged={(p) => setPillarFilter(p)} />
      </div>

      {habits.length ? (
        <>
          <div className={'mb-6'}>
            <GoalsCluster
              average={stats.averageCompletion}
              longestStreak={stats.longestStreak}
              streak={stats.currentStreak}
              total={stats.totalCompleted}
            />
          </div>

          <Daily />
          <Weekly />
          <Monthly />

          <div className={'text-left mb-6'}>
            <Typography
              usage="body"
              content={
                dailyActsAvg.habits.length ||
                weeklyActsAvg.habits.length ||
                monthlyActsAvg.habits.length
                  ? localization.getString('goalsChartExplainer')
                  : ''
              }
            />
          </div>
        </>
      ) : (
        <div
          className={
            'flex flex-col justify-center items-center content-center h-full'
          }
        >
          <Typography
            typeClass={[
              'mb-3',
              'mom_lightMode_text_neutral',
              'dark:mom_darkMode_text_neutral',
              'opacity-50'
            ]}
            usage="headingSmall"
          >
            {'No data available '}
          </Typography>
          {/* <Button buttonType="btn-primary" onClick={() => addAChallenge()}>
          Add a challenge
        </Button> */}
        </div>
      )}
    </div>
  );
}
function TrendsView({ onClose }: { onClose: () => void }) {
  const { trends } = useStats();

  return (
    <div className={'flex flex-col'}>
      <div className="grid grid-cols-3 mb-4">
        <Typography
          typeClass={[
            'text-mom_lightMode_text-primary dark:text-mom_darkMode_text-primary',
            'text-left'
          ]}
          usage="body"
          content="Back"
          onClick={onClose}
        />
        <Typography
          typeClass={[
            'text-mom_lightMode_text-neutral dark:text-mom_darkMode_text-neutral '
          ]}
          usage="headingSmall"
          content="Trends"
        />
      </div>
      {trends.better?.length ? (
        <>
          <div className="text-left ">
            <Typography usage="headingMedium" content="Keep it going" />
            <div className={'mb-4'} />

            <TrendCard trends={trends.better as any[]} />
          </div>
        </>
      ) : (
        <></>
      )}
      {trends.worse?.length ? (
        <>
          <div className="text-left">
            <Typography usage="headingMedium" content="Worth a look" />
            <div className={'mb-4'} />
            <TrendCard trends={trends.worse as any[]} />
          </div>
        </>
      ) : (
        <></>
      )}
      {trends.neutral?.length ? (
        <div className="text-left mb-6">
          <Typography usage="headingMedium" content="Needs more data" />
          <div className={'mb-4'} />
          <TrendCard trends={trends.neutral as any[]} />
        </div>
      ) : (
        <></>
      )}

      <div className={'flex-1'} />

      <Typography usage="body" typeClass={['text-left', 'opacity-75']}>
        {localization.getString('trendExplainer')}
      </Typography>
    </div>
  );
}

function AwardsListView({
  completed,
  upcoming
}: {
  completed: Award[];
  upcoming: Award[];
}) {
  return (
    <div>
      <div className={'mb-6'}>
        <Typography
          usage="headingMedium"
          content="Completed"
          typeClass={['mb-4']}
        />
        <div className={'space-y-4'}>
          {completed.map((a) => (
            <CardAward award={a} />
          ))}
        </div>
      </div>

      <div className={'mb-6'}>
        <Typography
          usage="headingMedium"
          content="Upcoming"
          typeClass={['mb-4']}
        />

        <div className={'space-y-2'}>
          {upcoming.map((a) => (
            <CardAward award={a} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AwardsView({ setOpen }: DialogProps) {
  const [screen, setScreen] = useState(0);
  const { awards, awardsNotEarned } = useAwards();

  const { challenges } = useChallenges();

  const challengesCompleted = useMemo(
    () =>
      challenges
        .filter((c) => c.active && c.progress >= 100)
        .map(challengeToAward),
    [challenges]
  );

  const challengesNotCompleted = useMemo(
    () =>
      challenges
        .filter((c) => c.active && c.progress < 100)
        .map(challengeToAward),
    [challenges]
  );

  const data = () => {
    if (screen === 0) {
      return [awards, awardsNotEarned];
    } else {
      return [challengesCompleted, challengesNotCompleted];
    }
  };

  const details = data();

  return (
    <div className={'flex-1 min-h-full flex flex-col'}>
      <div className="grid grid-cols-3 mb-4">
        <Typography
          typeClass={[
            'text-mom_lightMode_text-primary dark:text-mom_darkMode_text-primary',
            'text-left'
          ]}
          usage="body"
          content="Back"
          onClick={() => setOpen(false)}
        />
        <Typography
          typeClass={[
            'text-mom_lightMode_text-neutral dark:text-mom_darkMode_text-neutral  '
          ]}
          usage="headingSmall"
          content="Awards"
        />
      </div>

      <SegmentedControl
        optionLabels={['Goals', 'Challenges']}
        onOptionSelected={setScreen}
      />

      <div className={'mb-6'} />
      <div className={'text-left flex-1'}>
        {details[0].length > 0 || details[1].length > 0 ? (
          <AwardsListView completed={details[0]} upcoming={details[1]} />
        ) : (
          <EmptyChallengeProgress />
        )}
      </div>
    </div>
  );
}

function ProgressSummary({
  setTrendsOpen,
  setAwardsOpen,
  setGoalsOpen
}: {
  setTrendsOpen: (open: boolean) => void;
  setAwardsOpen: (open: boolean) => void;
  setGoalsOpen: (open: boolean) => void;
}) {
  const { completion, trends } = useStats();
  const { setInterfaceOpen } = useContext(CommonContext);
  const { satisfactions } = useSatisfactions();
  const { data } = useSelector(getData);
  const answers = data.questionnaireAnswers || [];

  const [results, setResults] = useState<{ [key: string]: number }>({
    exercise: answers[1]?.['exercise'] ?? 3,
    nutrition: answers[1]?.['nutrition'] ?? 3,
    'stress-management': answers[1]?.['stress-management'] ?? 3,
    social: answers[1]?.['social'] ?? 3,
    sleep: answers[1]?.['sleep'] ?? 3,
    'mental-stimulation': answers[1]?.['mental-stimulation'] ?? 3
  });
  const [lastUpdatedAt, setLastUpdatedAt] = useState('Today');
  const [dateIndex, setDateIndex] = useState(0);
  const [dateString, setDateString] = useState('');

  const { awards } = useAwards();
  const { challenges: allChallenges } = useChallenges();

  const challengeAwards: Award[] = (allChallenges || [])
    .filter((c) => c.progress >= 100)
    .map(challengeToAward);

  const allAwards = [...(awards || []), ...challengeAwards]
    .sort((a, b) => a.dateEarned - b.dateEarned)
    .slice(0, 3);

  useEffect(() => {
    if (satisfactions) {
      const recentRecord = { ...satisfactions[0] };
      if (satisfactions.length > 0) {
        setDateIndex(satisfactions.length);
      }
      setLastUpdatedAt(
        isToday(recentRecord?.createdAt)
          ? 'Today'
          : moment(recentRecord?.createdAt).format('MMM Do')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [satisfactions]);

  useEffect(() => {
    if (satisfactions) {
      const record = { ...satisfactions[satisfactions.length - dateIndex] };
      if (record.satisfactions) {
        const levels = { ...record.satisfactions };
        setResults(levels);
      }
      setDateString(
        isToday(record?.createdAt)
          ? 'Today'
          : moment(record?.createdAt).format('MMM Do')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateIndex, satisfactions]);

  const firstThreeTrends = useMemo(() => {
    if (!trends) {
      return [];
    }

    return [...trends.better, ...trends.worse, ...trends.neutral].splice(
      0,
      3
    ) as any[];
  }, [trends]);

  if (!trends) {
    return <>Loading...</>;
  }

  return (
    <>
      <div className={'flex justify-between mb-4'}>
        <Typography usage="headingMedium" content="Trends" />
        <button
          className={
            'text-mom_lightMode_text-primary dark:text-mom_lightMode_text-dark'
          }
          onClick={() => {
            window.scrollTo(0, 0);
            setTrendsOpen(true);
          }}
        >
          <Typography
            typeClass={['dark:text-mom_darkMode_text-primary']}
            content="Show All"
          />
        </button>
      </div>

      <TrendCard trends={firstThreeTrends} />

      <div className={'flex justify-between my-4'}>
        <Typography usage="headingMedium" content="Goals" />
        <button
          className={
            'text-mom_lightMode_text-primary dark:text-mom_lightMode_text-dark'
          }
          onClick={() => {
            window.scrollTo(0, 0);
            setGoalsOpen(true);
          }}
        >
          <Typography
            typeClass={['dark:text-mom_darkMode_text-primary']}
            content="Show All"
          />
        </button>
      </div>
      <GoalsCluster
        average={completion.averageCompletion}
        longestStreak={completion.longestStreak}
        streak={completion.currentStreak}
        total={completion.totalCompleted}
      />

      <div className={'flex justify-between my-4'}>
        <Typography usage="headingMedium" content="Awards" />
        <button
          className={
            'text-mom_lightMode_text-primary dark:text-mom_lightMode_text-dark'
          }
        >
          <Typography
            typeClass={['dark:text-mom_darkMode_text-primary']}
            content="Show All"
            onClick={() => {
              window.scrollTo(0, 0);

              setAwardsOpen(true);
            }}
          />
        </button>
      </div>

      {allAwards.length ? (
        <div className={'mb-8 space-y-4'}>
          {allAwards.map((a) => (
            <CardAward award={a} />
          ))}{' '}
        </div>
      ) : (
        <></>
      )}

      <Typography
        usage="headingMedium"
        content="Pillar profile"
        typeClass={['mb-4']}
      />
      <SpiderGraphWithSlider
        results={{
          exercise: results['exercise'],
          nutrition: results['nutrition'],
          stress: results['stress-management'],
          social: results['social'],
          mental: results['mental-stimulation'],
          sleep: results['sleep']
        }}
        value={dateIndex}
        dateLabel={dateString}
        length={satisfactions.length}
        onValueChanged={setDateIndex}
      />
      <Typography usage="body" typeClass={['mb-4 mt-4 opacity-75']}>
        Your pillar profile is based on how you last rated your level of
        satisfaction with these areas of your health.
      </Typography>
      <Typography usage="body" typeClass={['mb-6 text-left opacity-75']}>
        Last updated on <span className="font-bold">{lastUpdatedAt}</span>
      </Typography>
      <div className="px-8">
        <Button
          buttonClass={['headingSmall']}
          label="Update satisfaction levels"
          onClick={() => setInterfaceOpen('satisfactionBottomSheetOpen', true)}
        />
      </div>
    </>
  );
}

function EmptyHabitsProgress() {
  const { setInterfaceOpen } = useContext(CustomHabitContext);

  return (
    <div
      className={
        'flex flex-col justify-center items-center content-center h-full'
      }
    >
      <Typography
        typeClass={[
          'mb-3',
          'mom_lightMode_text_neutral',
          'dark:mom_darkMode_text_neutral',
          'opacity-50'
        ]}
        usage="headingSmall"
      >
        No data available yet
      </Typography>
      <Button
        buttonClass={['headingSmall']}
        buttonType="btn-primary"
        onClick={() => setInterfaceOpen('newHabitOpen', true)}
      >
        Add a habit
      </Button>
    </div>
  );
}
function EmptyChallengeProgress({
  previousActive
}: {
  previousActive?: boolean;
}) {
  const { setInterfaceOpen } = useContext(CustomHabitContext);
  const dispatch = useDispatch();

  const addAChallenge = () => {
    dispatch(setDataFieldWithID({ id: 'newHabitState', value: 'Challenges' }));
    setInterfaceOpen('newHabitOpen', true);
  };

  return (
    <div
      className={
        'flex flex-col justify-center items-center content-center h-full'
      }
    >
      <Typography
        typeClass={[
          'mb-3',
          'mom_lightMode_text_neutral',
          'dark:mom_darkMode_text_neutral',
          'opacity-50'
        ]}
        usage="headingSmall"
      >
        {previousActive
          ? 'No currently active challenges'
          : 'No data available yet'}
      </Typography>
      <Button
        buttonClass={['headingSmall']}
        buttonType="btn-primary"
        onClick={() => addAChallenge()}
      >
        Add a challenge
      </Button>
    </div>
  );
}

function HabitsProgress() {
  const { habits: allHabits, loading } = useUserHabits();

  const { setSelectedHabit, setInterfaceOpen } = useContext(CommonContext);

  const [pillarFilter, setPillarFilter] = useState<HabitPillarFilter>('all');

  const habits = useMemo(() => {
    if (pillarFilter === 'archived') {
      return allHabits.filter((h) => h.status === 'Archived');
    }

    return allHabits.filter((h: Habit) =>
      isHabitPillar(pillarFilter)
        ? h.pillars.includes(pillarFilter as HabitPillar) &&
          h.status !== 'Archived'
        : h.status !== 'Archived'
    );
  }, [pillarFilter, allHabits]);

  const dailyHabits = useMemo(
    () => habits.filter((h: any) => h.frequencyUnit === 'day'),
    [habits]
  );

  const weeklyHabits = useMemo(
    () => habits.filter((h: any) => h.frequencyUnit === 'week'),
    [habits]
  );

  const monthlyHabits = useMemo(
    () => habits.filter((h: any) => h.frequencyUnit === 'month'),
    [habits]
  );

  const statsArguments = (h: Habit) => {
    return {
      habit: h,
      stats: h.completionStats
    };
  };

  const graphArguments = (h: Habit) => {
    let resolution = 7;
    const { frequencyUnit, activities } = h;

    if (frequencyUnit === 'week') {
      resolution = 4;
    } else if (frequencyUnit === 'month') {
      resolution = 3;
    }

    const labels: string[] = [];
    const values: number[] = [];
    const acts = _.takeRight(activities, resolution);

    const curCycle = h.currentCycle;

    if (acts.length <= 1) {
      labels.push('Start');
      values.push(acts[0].completion);
    }

    for (let i = 0; i < acts.length; i += 1) {
      const act = acts[i];
      const isCurrent = act.cycle === curCycle;

      if (frequencyUnit === 'day') {
        labels.push(
          isCurrent
            ? 'Today'
            : moment.weekdaysShort()[moment(act.actDate).weekday()]
        );
      } else if (frequencyUnit === 'week') {
        labels.push(isCurrent ? 'This' : `w${act.cycle}`);
      } else {
        labels.push(
          isCurrent ? 'This' : moment.monthsShort()[moment(act.actDate).month()]
        );
      }
      values.push(act.completion);
    }
    return {
      labels,
      values
    };
  };

  if (!allHabits.length && !loading) {
    return <EmptyHabitsProgress />;
  }

  const openHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setInterfaceOpen('habitDetailsOpen', true);
  };

  return (
    <div className={'h-full'}>
      <PillarFilter onPillarChanged={(p) => setPillarFilter(p)} />
      {habits.length ? (
        <div className={' mt-6'}>
          {dailyHabits.length ? (
            <>
              <Typography usage="headingMedium" content="Daily Goals" />
              {dailyHabits.map((h: Habit) => (
                <div className={'mt-4'} key={h.id}>
                  <CardHabitStats
                    graph={graphArguments(h)}
                    {...statsArguments(h)}
                    onHeaderClick={() => openHabit(h)}
                  />
                </div>
              ))}
            </>
          ) : (
            <></>
          )}

          {weeklyHabits.length ? (
            <>
              <Typography
                usage="headingMedium"
                content="Weekly Goals"
                typeClass={['mt-6']}
              />
              {weeklyHabits.map((h: any) => (
                <div className={'mt-4'} key={h.id}>
                  <CardHabitStats
                    graph={graphArguments(h)}
                    {...statsArguments(h)}
                    onHeaderClick={() => openHabit(h)}
                  />
                </div>
              ))}{' '}
            </>
          ) : (
            <></>
          )}

          {monthlyHabits.length ? (
            <>
              <Typography
                usage="headingMedium"
                content="Monthly Goals"
                typeClass={['mt-6']}
              />
              {monthlyHabits.map((h: any) => (
                <div className={'mt-4'} key={h.id}>
                  <CardHabitStats
                    graph={graphArguments(h)}
                    {...statsArguments(h)}
                    onHeaderClick={() => openHabit(h)}
                  />
                </div>
              ))}{' '}
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className={'flex-1 h-full'}>
          <EmptyHabitsProgress />
        </div>
      )}
    </div>
  );
}

function ChallengesPage() {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState(0);
  const [challenge, setChallenge] = useState<Challenge | undefined>(undefined);

  const { challenges } = useChallenges();

  const { data } = useSelector(getData);
  const { appearanceOption } = data;

  const active = useMemo(
    () => challenges.filter((c) => c.active),
    [challenges]
  );

  const archiveComplete = useMemo(
    () => challenges.filter((c) => !c.active && c.progress >= 100),
    [challenges]
  );
  const archiveIncomplete = useMemo(
    () => challenges.filter((c) => !c.active && c.progress < 100),
    [challenges]
  );

  // Hmm..
  const totalCompleted = challenges.filter((c) => c.progress >= 100).length;

  const pastOrComplete = challenges.filter(
    (c) => Date.now() >= c.endDate || c.progress >= 100
  );

  const avgCompletion =
    pastOrComplete.length > 0
      ? pastOrComplete.map((c) => c.progress).reduce((a, b) => a + b) /
        pastOrComplete.length
      : 0;

  const openChallenge = (c: Challenge) => {
    setChallenge(c);
    setOpen(true);
  };

  const view = screen === 0 ? archiveComplete : archiveIncomplete;

  const Tiles = () => (
    <div className={'grid grid-cols-2 gap-4'}>
      <StatTile
        Icon={<TotalIcon />}
        stat={'Done in total'}
        value={`${totalCompleted} challenges`}
      />
      <StatTile
        Icon={<CompletionIcon />}
        stat={'Avg completion'}
        value={`${avgCompletion.toFixed(0)}%`}
      />
    </div>
  );

  const Active = () => {
    return (
      <>
        {active.length > 0 ? (
          <>
            <Typography usage="headingMedium" content="Active" />
            {active.map((c) => (
              <CardChallenge
                key={c.id}
                cardType={'card-actionable'}
                challengeName={c.title}
                totalDuration={c.duration}
                completedDuration={c.progress}
                timeUnit={c.frequency}
                Icon={() => challengeIconFrame(c, appearanceOption)}
                onClick={() => openChallenge(c)}
              />
            ))}
          </>
        ) : (
          <></>
        )}
      </>
    );
  };

  const ArchiveOrComplete = () => {
    return (
      <>
        {view.length ? (
          view.map((c) => (
            <CardChallenge
              key={c.id}
              cardType={'card-actionable'}
              challengeName={c.title}
              totalDuration={c.duration}
              completedDuration={c.progress}
              timeUnit={c.frequency}
              Icon={() => challengeIconFrame(c, appearanceOption, 'dimmed')}
              onClick={() => openChallenge(c)}
            />
          ))
        ) : (
          <div
            className={'flex-1 flex justify-center items-center content-center'}
          >
            <Typography
              typeClass={[
                'mb-3',
                'mom_lightMode_text_neutral',
                'dark:mom_darkMode_text_neutral',
                'opacity-50'
              ]}
              usage="headingSmall"
            >
              No data available yet
            </Typography>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className={'space-y-4 h-full flex flex-col'}>
        {/* {challenges.length > 0 ? <Tiles /> : <></>} */}
        {active.length > 0 ? (
          <>
            <Tiles />
            <Active />
          </>
        ) : (
          <EmptyChallengeProgress previousActive={challenges.length > 0} />
        )}
        {challenges.length > 0 ? (
          <>
            <Typography usage="headingMedium" content="Archived" />
            <SegmentedControl
              optionLabels={['Completed', 'Incomplete']}
              onOptionSelected={(o) => setScreen(o)}
            />
            <ArchiveOrComplete />
          </>
        ) : (
          <></>
        )}
      </div>

      {challenge ? (
        <ChallengeDetailsSheet
          open={open}
          setOpen={setOpen}
          challenge={challenge}
          viewMode={Date.now() >= challenge.startDate && challenge.active}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export const Tracking = (): ReactElement => {
  const [screen, setScreen] = useState(0);

  const [trendsOpen, setTrendsOpen] = useState(false);
  const [awardsOpen, setAwardsOpen] = useState(false);
  const [goalsOpen, setGoalsOpen] = useState(false);

  if (awardsOpen) {
    return <AwardsView open={awardsOpen} setOpen={setAwardsOpen} />;
  }

  if (trendsOpen) {
    return <TrendsView onClose={() => setTrendsOpen(false)} />;
  }

  if (goalsOpen) {
    return <GoalsView onClose={() => setGoalsOpen(false)} />;
  }

  const CurrentScreen = () => {
    if (screen === 0) {
      return (
        <ProgressSummary
          setTrendsOpen={setTrendsOpen}
          setAwardsOpen={setAwardsOpen}
          setGoalsOpen={setGoalsOpen}
        />
      );
    } else if (screen === 1) {
      return <HabitsProgress />;
    } else {
      return <ChallengesPage />;
    }
  };

  return (
    <div className={'flex-1 min-h-full flex flex-col pb-8'}>
      <div className={'flex flex-col flex-1 text-left min-h-full'}>
        <div className={'text-left'}>
          <Typography usage="headingLarge">Progress</Typography>
        </div>
        <div className={'py-6'}>
          <SegmentedControl
            optionLabels={['Overview', 'Habits', 'Challenges']}
            onOptionSelected={setScreen}
          />
        </div>
        <CurrentScreen />
      </div>
    </div>
  );
};
