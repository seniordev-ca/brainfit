import { habitPillars, statsInformation } from 'helpers/utils';
import { Habit } from 'models/habit';
import { Award, Challenge, HabitPillar, Stats } from 'types/types';

type CheckFn = (details: Details) => boolean;

type Details = {
  stats: Stats;
  habits: Habit[];
  challenges: Challenge[];
};

type AwardWithCheck = Exclude<Award, 'dateEarned'> & {
  isComplete: CheckFn;
};

function createAward(
  id: string,
  title: string,
  description: string,
  unearnedDescription: string,
  isComplete: CheckFn
): AwardWithCheck {
  return {
    id,
    title,
    description,
    unearnedDescription,
    isComplete,
    dateEarned: 0
  };
}

function streakAward(streak: number) {
  return createAward(
    `award_streak_${streak}`,
    `${streak} day streak`,
    `
    You received this award for completing all of your habits within a ${streak} day period`,
    `You will receive this award for completing all of your habits within a ${streak} day period`,
    ({ stats }) => stats.completion.currentStreak >= streak
  );
}

function pillarStreakAward(pillar: HabitPillar, streak: number) {
  return createAward(
    `award_pillar_streak_${pillar.replace(' ', '_').toLowerCase()}_${streak}`,
    `${pillar} ${streak} day streak`,
    `You received this award for having a ${pillar} habit streak for a ${streak} day period`,
    `You will receive this award for having a ${pillar} habit streak for a ${streak} day period`,
    ({ habits }) =>
      statsInformation(habits.filter((h) => h.pillars.includes(pillar)))
        .currentStreak >= streak
  );
}

const fullyCompletedDay = createAward(
  'award_day_completed',
  'Fully completed first day',
  'You received this award for fully completing your first day',
  'You will receive this award for fully completing your first day',
  () => false
);
const fullyCompletedHabit = createAward(
  'award_habit_completed',
  'Fully completed first habit',
  'You received this award for fully completing your first habit',
  'You will receive this award for fully completing your first habit',
  ({ habits }) =>
    habits.find((h) => h.progress >= 100 && Date.now() >= h.endDate)
      ? true
      : false
);

const fullyCompletedChallenge = createAward(
  'award_first_challenge',
  'Completed first challenge',
  'You received this award for fully completing your first challenge',
  'You will receive this award for fully completing your first challenge',
  ({ challenges }) => (challenges.find((c) => c.progress >= 100) ? true : false)
);

const allPillarAwards = habitPillars
  .map((p) => [
    pillarStreakAward(p, 7),
    pillarStreakAward(p, 14),
    pillarStreakAward(p, 21)
  ])
  .reduce((a, b) => [...a, ...b]);

const firstHabitProgress = createAward(
  'award_first_progress',
  'Tracked first progress',
  'You received this award for tracking your first progress',
  'You will receive this award for tracking your first progress',
  ({ habits }) => (habits.find((h) => h.progress > 0) ? true : false)
);

export const habitAwards = [
  streakAward(7),
  streakAward(14),
  streakAward(21),

  firstHabitProgress,

  fullyCompletedHabit,
  fullyCompletedChallenge,
  fullyCompletedDay,

  ...allPillarAwards
];

export const awardIds = habitAwards.map((a) => a.id);
