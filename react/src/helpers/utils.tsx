import * as contentful from 'contentful';
import moment, { Moment } from 'moment';

import dayjs from 'dayjs';

import {
  Award,
  Challenge,
  ContentfulChallenge,
  DatabaseSavedSatisfactions,
  HabitColour,
  HabitFrequency,
  HabitPillar,
  HabitPillarFilter,
  NotificationItem,
  SavedSatisfactions,
  StatTrend,
  Trends
} from 'types/types';

import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { Icon } from '@iconify/react';
import { IconFrame, IconSurfaceType } from 'Components/IconFrame/IconFrame';
import duration from 'dayjs/plugin/duration';
import { ReactComponent as BrainSVG } from 'img/home_last_logo.svg';
import _ from 'lodash';

import { Habit } from 'models/habit';
import { ReactElement } from 'react';
import { addNotification } from 'slices/dataSlice';
import store from 'store/store';
import { ReactComponent as AllSVG } from '../img/Pillars/icon_pillar_all.svg';
import { ReactComponent as ExerciseSVG } from '../img/Pillars/icon_pillar_exercise.svg';
import { ReactComponent as MentalSVG } from '../img/Pillars/icon_pillar_mental.svg';
import { ReactComponent as NutritionSVG } from '../img/Pillars/icon_pillar_nutrition.svg';
import { ReactComponent as SleepSVG } from '../img/Pillars/icon_pillar_sleep.svg';
import { ReactComponent as SocialSVG } from '../img/Pillars/icon_pillar_social.svg';
import { ReactComponent as StressSVG } from '../img/Pillars/icon_pillar_stress.svg';
import { Activity } from 'models/activity';
import { ListItem } from 'Components/ListItem/ListItem';

dayjs.extend(duration);

export const neverEndingDate = moment().year(2099).valueOf();

export const habitPillars: HabitPillar[] = [
  'Exercise',
  'Nutrition',
  'Stress Management',
  'Social Activity',
  'Sleep',
  'Mental Stimulation'
];

export const habitColours: HabitColour[] = [
  'default',
  'Exercise',
  'Nutrition',
  'Stress Management',
  'Social Activity',
  'Sleep',
  'Mental Stimulation',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'teal',
  'green',
  'blue',
  'lightBlue',
  'brown',
  'grey',
  'black'
];

export function fixPillarFormatting(pillar: string): HabitPillar {
  pillar = pillar.toLowerCase().trim();

  if (/exercise/.test(pillar)) {
    return 'Exercise';
  } else if (/nutrition/.test(pillar)) {
    return 'Nutrition';
  } else if (/stress/.test(pillar)) {
    return 'Stress Management';
  } else if (/social/.test(pillar)) {
    return 'Social Activity';
  } else if (/sleep/.test(pillar)) {
    return 'Sleep';
    // Mental
  } else {
    return 'Mental Stimulation';
  }
}

export function getColorForPillar(pillar: string) {
  pillar = pillar.toLowerCase();

  if (/exercise/.test(pillar)) {
    return 'mom_pillar-exercise';
  } else if (/nutrition/.test(pillar)) {
    return 'mom_pillar-nutrition';
  } else if (/stress/.test(pillar)) {
    return 'mom_pillar-stress';
  } else if (/social/.test(pillar)) {
    return 'mom_pillar-social';
  } else if (/sleep/.test(pillar)) {
    return 'mom_pillar-sleep';
  } else if (/mental/.test(pillar)) {
    return 'mom_pillar-mental';
  } else {
    return '';
  }
}

export function formatDateForDisplay(date: Moment) {
  return date.isSame(moment(), 'day') ? 'Today' : date.format('LL');
}

export function isHabitPillar(
  filter: HabitPillar | HabitPillarFilter
): filter is HabitPillar {
  return filter !== 'all' && filter !== 'archived';
}

export function databaseSatisfactionsToSavedSatisfactions(
  input: DatabaseSavedSatisfactions
): SavedSatisfactions {
  let satisfactions: SavedSatisfactions = {
    id: input.ID,
    satisfactions: input.Satisfactions,
    createdAt: input.CreatedAt
  };
  return satisfactions;
}

export const frequencyUnitToMS = {
  day: dayjs.duration(1, 'day').asMilliseconds(),
  week: dayjs.duration(1, 'week').asMilliseconds(),
  month: dayjs.duration(1, 'month').asMilliseconds()
};

export const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

type CalculateCycleInput = {
  start: number;
  target: number;
  frequency: HabitFrequency;
  frequencyCount: number;
};

// Cycles start at 1 instead of 0.
/**
 * Using a target date (number), start date (number),
 * frequency ({@link HabitFrequency}), and frequencyCount (number):
 *
 * A calculation is made to determine in which period does the given `target` fall under relative to the start date given
 *
 * For example given a `start` of ereyesterday, `target` of today, frequency of `day` and frequencyCount of `1`,
 * This function would return `3`. This is because since the day before yesterday(ereyesterday), today would be the third day since.
 *
 * For a broader `frequencyCount` for example in a `day` frequency where `frequencyCount = 2`,
 * using our example above the resulting output would be `2` because this would be the `Math.floor(3/2) + 1`th day since ereyesterday
 * 
 * Practically expressed as assuming `frequencyCount = 1`:
 *
 * `day` frequency:
 * Day 1 would be cycle 1,
 * Day 2 would be cycle 2
 * ..and so on
 *
 * `week` frequency:
 * Days 1-7 (Week 1) would be cycle 1
 * Every week after would be another cycle, so week 2 would be cycle 2
 * ..and so on
 *
 * `month` frequency:
 * Days 1-30/31 wouuld be cycle 1,
 * Every month after would be another cycle, so month 2 would be cycle 2.
 *

 * @param input a {@link CalculateCycleInput}
 * @returns The calculated cycle, starting from `1` or returning `0` if the start is after the target
 */
export function calculateWhichCycle({
  start,
  target,
  frequency,
  frequencyCount = 1
}: CalculateCycleInput) {
  // Hasn't started yet.
  if (start > target) {
    return 0;
  }

  const whichFR = Math.floor(
    (target - start) / (frequencyUnitToMS[frequency] * frequencyCount)
  );

  return whichFR + 1;
}

export const contentfulPillarsToSavedPillars = (pillars: string) => {
  let savedPillars: HabitPillar[] = [];

  if (pillars.includes('Exercise')) {
    savedPillars.push('Exercise');
  }

  if (pillars.includes('Nutrition')) {
    savedPillars.push('Nutrition');
  }

  if (pillars.includes('Mental Stimulation')) {
    savedPillars.push('Mental Stimulation');
  }

  if (pillars.includes('Sleep')) {
    savedPillars.push('Sleep');
  }

  if (pillars.includes('Social Activity')) {
    savedPillars.push('Social Activity');
  }

  if (pillars.includes('Stress Management')) {
    savedPillars.push('Stress Management');
  }

  return savedPillars;
};

export const processContentfulAssetURL = (assetURL?: string) => {
  if (assetURL) {
    return assetURL.includes('https') ? assetURL : `https:${assetURL}`;
  }
  return assetURL;
};

export function cmsChallengeToChallenge(
  c: contentful.Entry<ContentfulChallenge>
): Challenge {
  return {
    ...c.fields,
    id: c.sys.id,
    // @ts-ignore
    description: documentToHtmlString(c.fields.description),
    subtitle: c.fields.subtitle || '',
    startDate: moment().startOf('day').add(1, 'day').startOf('day').valueOf(),
    endDate: dayjs().add(c.fields.duration, 'days').valueOf(),
    frequency: 'day',
    active: false,
    progress: 0,
    headerImage: processContentfulAssetURL(
      c.fields.headerImage?.fields?.file?.url
    ),
    darkModeHeaderImage: processContentfulAssetURL(
      c.fields.darkModeHeaderImage?.fields?.file?.url
    ),
    challengeHabits:
      c.fields.challengeHabits?.filter((h) => h.fields).map((h) =>
        Habit.createFromContentfulHabit(h)
      ) || []
  };
}

export const getTimeFormattedValue = (
  value: any,
  type: 'hour' | 'minute' | 'second' = 'second'
) => {
  let output = '';
  if (type === 'hour') {
    let [hour, minute = 0] = value.toString().split('.');
    minute = Math.round((+minute / 100) * 60);
    output = `${hour}:${minute < 10 ? `0${minute}` : minute}`;
  } else if (type === 'minute') {
    let [minute, second = 0] = value.toString().split('.');
    const hour = Math.trunc(+minute / 60);
    second = Math.round((+minute / 100) * 60);
    minute = minute % 60;
    output = `${hour}:${minute < 10 ? `0${minute}` : minute}:${second < 10 ? `0${second}` : second
      }`;
  } else if (type === 'second') {
    const second = value % 60;
    let minute = Math.trunc(+value / 60);
    output = `${minute < 10 ? `0${minute}` : minute}:${second < 10 ? `0${second}` : second
      }`;
    let hour;
    if (minute > 60) {
      hour = Math.trunc(+minute / 60);
      minute %= 60;
      output = `${hour}:${minute < 10 ? `0${minute}` : minute}:${second < 10 ? `0${second}` : second
        }`;
    }
  }

  return output;
};

export const habitPillarsToString = (pillars: HabitPillar[]) => {
  return pillars.map((pillar) => pillar).join(', ');
};

export const getProperHabitCss = (
  pillars: string | undefined,
  oneWordCheck?: boolean //NOTE: This method was properly functional, but a bug occuring when displaying habit colorDots led to an additional flag check solution
): string | undefined => {
  if (pillars === undefined) {
    return undefined;
  }

  let newPillars: string = pillars;

  newPillars = newPillars.replace('Exercise', 'exercise');
  newPillars = newPillars.replace('Nutrition', 'nutrition');
  newPillars = newPillars.replace('Stress Management', 'stress');
  newPillars = newPillars.replace('Social Activity', 'social');
  newPillars = newPillars.replace('Sleep', 'sleep');
  newPillars = newPillars.replace('Mental Stimulation', 'mental');

  if (oneWordCheck) {
    newPillars = newPillars.replace('Stress', 'stress');
    newPillars = newPillars.replace('Social', 'social');
    newPillars = newPillars.replace('Mental', 'mental');
  }

  return newPillars;
};

export const getPillarFromPillars = (pillars: HabitPillar[]): HabitPillar => {
  if (pillars.includes('Exercise')) {
    return 'Exercise';
  }

  if (pillars.includes('Nutrition')) {
    return 'Nutrition';
  }

  if (pillars.includes('Mental Stimulation')) {
    return 'Mental Stimulation';
  }

  if (pillars.includes('Sleep')) {
    return 'Sleep';
  }

  if (pillars.includes('Social Activity')) {
    return 'Social Activity';
  }

  if (pillars.includes('Stress Management')) {
    return 'Stress Management';
  }

  return 'Exercise';
};

export const challengeIconFrame = (
  challenge: Challenge,
  appearanceOption: string,
  iconFrameBackground?: IconSurfaceType
) => {
  if (
    challenge.darkModeHeaderImage &&
    (appearanceOption === 'dark' ||
      (appearanceOption === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches))
  ) {
    return <IconFrame url={challenge.darkModeHeaderImage} />;
  }

  if (challenge.headerImage) {
    return <IconFrame url={challenge.headerImage} />;
  }

  return <IconFrame iconSurfaceType={iconFrameBackground} Icon={BrainSVG} />;
};

function computeTimeString(value: number) {
  const hours = Math.floor(value / (60 * 60));
  const minutes = Math.floor((value % (60 * 60)) / 60);
  const seconds = Math.floor(value % 60);

  let result = '';

  if (hours) {
    result += `${hours} ${hours > 1 ? 'hours' : 'hour'} `;
  }

  if (minutes) {
    result += `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} `;
  }

  if (seconds) {
    result += `${seconds} ${seconds > 1 ? 'seconds' : 'second'} `;
  }

  return result.trim() || '0';
}

export const displayStatusString = (habit: Habit) => {
  const isTime = /time/i.test(habit.units);

  const format = (value: any) => {
    if (isTime) {
      return computeTimeString(value);
    } else {
      return value;
    }
  };

  let unitString = habit.units;

  if (unitString === 'Count') {
    unitString = habit.targetValue === 1 ? 'time' : 'times';
  }

  if (habit.status === 'Paused') {
    return 'Paused';
  }

  return `${format(habit.targetValue)} ${isTime ? '' : unitString}`;
};

export const displayStatusAndGoalString = (
  habit: Habit,
  progress: number | undefined,
  skipped: boolean | undefined
) => {
  const isTime = /time/i.test(habit.units);
  const format = (value: any) => {
    if (isTime) {
      return computeTimeString(value);
    } else {
      return value;
    }
  };

  let unitString = habit.units.toLowerCase();

  if (unitString === 'count') {
    unitString = habit.targetValue === 1 ? 'time' : 'times';
  }

  if (habit.status === 'Paused') {
    return 'Paused';
  }

  if (skipped) {
    return `${format(habit.targetValue)} ${isTime ? '' : unitString} skipped`;
  }

  const statusString = `${format(progress)} of ${format(habit.targetValue)} ${isTime ? '' : unitString}`;
  const goalString = habit.breakHabit ? 'remaining' : 'completed';
  if (statusString.length > 54) return `${statusString.slice(0, 54)}... ${goalString}`
  return `${statusString} ${goalString}`;
};

export const getDateText = (date: Moment) => {
  const today = moment();

  if (date.format('YYYYMMDD') === today.format('YYYYMMDD')) {
    return 'Today';
  } else if (
    date.year() === today.year() &&
    date.month() === today.month() &&
    +date.day() === +today.day() + 1
  ) {
    return 'Tomorrow';
  } else {
    return date.format('MMM DD, YYYY');
  }
};

export const getDefaultIconFromPillars = (
  pillars: HabitPillar[]
): ReactElement => {
  if (pillars.includes('Exercise')) {
    return <ExerciseSVG />;
  }

  if (pillars.includes('Mental Stimulation')) {
    return <MentalSVG />;
  }

  if (pillars.includes('Nutrition')) {
    return <NutritionSVG />;
  }

  if (pillars.includes('Sleep')) {
    return <SleepSVG />;
  }

  if (pillars.includes('Social Activity')) {
    return <SocialSVG />;
  }

  if (pillars.includes('Stress Management')) {
    return <StressSVG />;
  }

  return <AllSVG />;
};

export function habitIcon(
  habitColour: string,
  habitPillars: HabitPillar[],
  habitIcon?: string
) {
  if (habitIcon !== '') {
    return habitIcon?.startsWith('eva:') || habitIcon?.startsWith('mdi:') ? (
      <Icon
        icon={habitIcon}
        className={`habitGlyph w-[50%] ${habitColour.toLowerCase()} !bg-transparent`}
        width="40"
        height="40"
        inline={false}
      />
    ) : (
      <div
        className={`display-icon habitGlyph w-10 h-10`}
        style={{
          fontSize: '20px'
        }}
      >
        {habitIcon}
      </div>
    );
  } else {
    return (
      <div
        className={`display-default-icon habitGlyph !w-10 items-center ${habitColour} !bg-transparent`}
      >
        {getDefaultIconFromPillars(habitPillars)}
      </div>
    );
  }
}

export const isToday = (date: string) => {
  return moment(date).isSame(new Date(), 'day');
};

export const addNotificationToState = (notification: NotificationItem) => {
  store.dispatch(
    addNotification({
      ...notification,
      id: notification.id ? notification.id : new Date().getTime()
    })
  );
};

export function challengeToAward(c: Challenge): Award {
  return {
    id: `award_challenge_${c.id}`,
    description: `You received this award for completing the ${c.title} challenge`,
    unearnedDescription: `You will receive this award for completing the ${c.title} challenge`,
    title: c.title,
    challengeId: c.id,
    dateEarned: c.progress >= 100 ? c.endDate : 0
  };
}

export const includesPillar = (value: string): boolean => {
  if (value.includes('Exercise')) {
    return true;
  }

  if (value.includes('Mental Stimulation')) {
    return true;
  }

  if (value.includes('Nutrition')) {
    return true;
  }

  if (value.includes('Sleep')) {
    return true;
  }

  if (value.includes('Social Activity')) {
    return true;
  }

  if (value.includes('Stress Management')) {
    return true;
  }

  return false;
};

//color utils
export const colorToRGB: {
  [key in HabitColour]: string;
} = {
  black: '33, 33, 33',
  blue: '78, 127, 173',
  brown: '137,106,88',
  yellow: '237,187,50',
  red: '186,80,80',
  teal: '95,149,139',
  purple: '170,108,188',
  green: '123,138,88',
  grey: '134,134,134',
  lightBlue: '94,178,191',
  orange: '217,131,85',
  pink: '234,102,153',

  default: '129, 88, 137',
  Exercise: '186,80,80',
  Nutrition: '123,138,88',
  'Stress Management': '78, 127, 173',
  'Social Activity': '217, 131, 85',
  Sleep: '237, 187, 50',
  'Mental Stimulation': '170, 108, 188'
};
export function rgbToHex(color: string) {
  const [r, g, b] = color.split(',').map((s) => Number(s.trim()));

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
export function colToRGB(col: HabitColour, dark: boolean = false) {
  if (col === 'default' && dark) {
    return '240, 200, 175';
  } else {
    return colorToRGB[col];
  }
}

export function componentToHex(c: Number) {
  var hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

export function habitFrequencyToDisplayText(
  f: HabitFrequency,
  frequencyQuantity: number = 1
) {
  if (frequencyQuantity === 1) {
    if (f === 'month') {
      return 'Monthly';
    } else if (f === 'week') {
      return 'Weekly';
    } else {
      return 'Daily';
    }
  } else if (frequencyQuantity === 2) {
    if (f === 'month') {
      return 'Every other month';
    } else if (f === 'week') {
      return 'Every other week';
    } else {
      return 'Every other day';
    }
  } else {
    if (f === 'month') {
      return `Every ${frequencyQuantity} months`;
    } else if (f === 'week') {
      return `Every ${frequencyQuantity} weeks`;
    } else {
      return `Every ${frequencyQuantity} days`;
    }
  }
}

export function getClassForTextHabitColour(color: HabitColour) {
  if (habitPillars.includes(color as any)) {
    return `text-mom_pillar-${color.toLowerCase().split(' ')[0]}`;
  } else {
    return `text-mom_lightMode_icon-${color}`;
  }
}

/**
 * Calculate the average completion for all of the habits on a given Date provided that
 * The Habit in the given habits is scheduled for that given Date.
 *
 *
 * @param habits The group of habits to calculate for
 * @param date The date used in {@link Habit.isScheduledFor}
 * @returns
 */
export function averageCompletionForDate(habits: Habit[], date: number) {
  const habitsForTheDay = habits.filter((h) => h.isScheduledFor(date));
  const allCompletions = habitsForTheDay.map(
    (a) => a.getActivityForDate(date)?.completion || 0
  );
  const total = allCompletions.length
    ? allCompletions.reduce((a, b) => a + b)
    : 0;
  return Math.round(total / (habitsForTheDay.length || 1));
}

/**
 * This method calculates a variety of stats based upon the given {@link Habit} array.
 *
 * Streaks are calculated with the following methodology:
 * From the earliest start date taken from the `habits` array, we will calculate the {@link averageCompletionForDate} for every day
 * from that date. For each day where `averageCompletion >= 100`, the streak will increment by `1`. For each day where that condition is not met,
 * the streak will reset.
 *
 * `averageCompletion`: For every habit's activities, calculate the average completion of the combined group.
 *
 * `totalCompleted`: The sum of the total amount of completions for every habit on a per day basis.
 *
 * @param habits The array of habits to calculate statistics for.
 */
export function statsInformation(habits: Habit[]) {
  if (!habits.length) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCompleted: 0,
      averageCompletion: 0
    };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let totalCompleted = 0;
  let totalProgress = 0;

  const earliestDate = moment(_.minBy(habits, (a) => a.startDate)!.startDate)
    .startOf('day')
    .valueOf();

  const allActs = habits.map((h) =>
    // We only want our activities with the matching frequency.
    h.activities.filter((a) => a.frequency === h.frequencyUnit)
  );
  const acts = allActs.length ? allActs.reduce((a, b) => [...a, ...b]) : [];

  for (let i = 0; i < acts.length; i += 1) {
    const act = acts[i];

    if (act.isComplete) {
      totalCompleted += 1;
    }

    // This gives a whole number
    totalProgress += act.completion;
  }

  const averageCompletion = Math.round(totalProgress / (acts.length || 1));

  const updateStreak = (add: boolean) => {
    if (add) {
      currentStreak += 1;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  };
  const daysBetween = moment().diff(earliestDate, 'day');

  for (let i = 0; i < daysBetween + 1; i += 1) {
    // Use fast math because this will be converted to a moment object in Habit.isScheduledFor
    const date = earliestDate + i * frequencyUnitToMS['day'];

    // Just in case I did some jank.
    if (date > Date.now()) {
      break;
    }
    const avg = averageCompletionForDate(habits, date);

    if (avg >= 100) {
      updateStreak(true);
    } else {
      updateStreak(false);
    }
  }

  return {
    currentStreak,
    longestStreak,
    totalCompleted,
    averageCompletion
  };
}

/**
 * Calculates  trending statistics by pillar based off of the current week's progress vs the last week's progress.
 * @param habits  The habits to calculate the information from
 * @returns
 */
export function trendsInformation(habits: Habit[]) {
  const pillars = habits.map((h) => h.pillars);

  const allSeen = Array.from(
    new Set(pillars.length ? pillars.reduce((a, b) => [...a, ...b]) : [])
  );
  const notSeen = _.difference(habitPillars, allSeen);

  const needsMoreData = new Set<HabitPillar>(habitPillars);

  const startOfWeek = dayjs().startOf('week');

  const oneWeekAgo = startOfWeek.subtract(1, 'week');

  const getAverages = (acts: Activity[]) => {
    const out: {
      [key: string]: number;
    } = {};
    for (let i = 0; i < acts.length; i += 1) {
      const act = acts[i];
      let completion = act.completion;
      const pillars = act.pillars;

      for (let i = 0; i < pillars.length; i++) {
        const pillar = pillars[i];
        out[pillar] = (out[pillar] || 0) + completion;
        if (out[pillar] > 0 && needsMoreData.has(pillar)) {
          needsMoreData.delete(pillar);
        }
      }
    }
    return out;
  };

  const _actThisWeek = !habits.length
    ? []
    : habits
      // If this habit was at any point scheduled for showing last week.
      .filter((h) => {
        for (let i = 0; i < new Date().getDay(); i += 1) {
          const n = startOfWeek.clone().add(i, 'day').valueOf();
          if (h.isScheduledFor(n)) {
            return true;
          }
        }
        return false;
      })
      .map((h) => h.activities);

  const actThisWeek = _actThisWeek.length
    ? _actThisWeek.reduce((a, b) => [...a, ...b])
    : [];

  console.log(
    'Shown this week',
    habits
      // If this habit was at any point scheduled for showing last week.
      .filter((h) => {
        for (let i = 0; i < new Date().getDay() + 1; i += 1) {
          const n = startOfWeek.clone().add(i, 'day').valueOf();
          if (h.isScheduledFor(n)) {
            return true;
          }
        }
        return false;
      }),
    actThisWeek
  );
  // .filter((a) => startOfWeek.isSame(a.actDate, 'week'));

  const _actLastWeek = !habits.length
    ? []
    : habits

      .filter((h) => {
        for (let i = 0; i < 7; i += 1) {
          const n = oneWeekAgo.clone().add(i, 'day').valueOf();
          if (h.isScheduledFor(n)) {
            return true;
          }
        }
        return false;
      })

      .map((h) => h.activities);

  const actLastWeek = _actLastWeek.length
    ? _actLastWeek.reduce((a, b) => [...a, ...b])
    : [];

  console.log(
    'Shown last week',
    habits
      // If this habit was at any point scheduled for showing last week.

      .filter((h) => {
        for (let i = 0; i < 7; i += 1) {
          const n = oneWeekAgo.clone().add(i, 'day').valueOf();
          if (h.isScheduledFor(n)) {
            return true;
          }
        }
        return false;
      })
  );
  // .filter((a) => oneWeekAgo.isSame(a.actDate, 'week'));

  const currentAverages = getAverages(actThisWeek);
  const lastWeekAverages = getAverages(actLastWeek);

  const notApplicable = new Set<HabitPillar>();

  for (let i = 0; i < habitPillars.length; i += 1) {
    const pillar = habitPillars[i];

    const everyWith = habits.filter((h) => h.pillars.includes(pillar));

    console.log('Shown every with', pillar, everyWith);
    if (everyWith.every((h) => h.frequencyUnit === 'month')) {
      notApplicable.add(pillar);
    }
  }

  console.log('Shown avg', currentAverages);

  const trends: Trends = {
    better: [],
    worse: [],
    neutral: []
  };

  allSeen.forEach((pillar: HabitPillar) => {
    const curr = currentAverages[pillar] || 0;
    const last = lastWeekAverages[pillar] || 0;

    const difference = curr - last;
    // MIND-683
    const change = curr === 0 ? 0 : difference / curr;

    const trend: StatTrend = {
      pillar,
      hasNoProgress: needsMoreData.has(pillar),
      hasNoApplicableHabits: notApplicable.has(pillar),
      direction: !last || curr >= last ? 'better' : 'worse',
      change: Math.floor(!last ? curr : Math.abs(change * 100))
    };

    if (!last || curr >= last) {
      trends.better.push(trend);
    } else {
      trends.worse.push(trend);
    }
  });

  trends.better.sort((a, b) => b.change - a.change);
  trends.worse.sort((a, b) => b.change - a.change);

  notSeen.forEach((v) => {
    trends.neutral.push({
      pillar: v,
      direction: 'neutral',
      change: 0
    });
  });

  console.log('shown OT', trends);

  return trends;
}

export function randomForNotifId() {
  return _.random(1, Number.MAX_SAFE_INTEGER);
}

export function HabitListItem({
  habit,
  iconColourClass,
  sublabel,
  onClick
}: {
  habit: Habit;
  onClick?: () => any;
  sublabel?: string;
  iconColourClass?: string;
}) {
  iconColourClass ||= habit.pillars[0].split(' ')[0].toLowerCase();
  return (
    <ListItem
      prefix={
        <div className="habitIcon_container">
          <div
            className={[
              'habitIcon_circle bg-opacity ',
              `bg-mom_lightMode_icon-${iconColourClass
                .split(' ')[0]
                .toLowerCase()}`
            ].join(' ')}
          >
            <div className="habitGlyph_container">
              <div
                className={`display-default-icon habitGlyph !w-10 items-center ${habit.colour} !bg-transparent`}
              >
                {habitIcon(habit.colour, habit.pillars, habit.icon)}
              </div>
            </div>
          </div>
        </div>
      }
      listType="list-primary"
      label={habit.title}
      sublabel={
        sublabel ||
        habitFrequencyToDisplayText(
          habit.frequencyUnit,
          habit.frequencyUnitQuantity
        )
      }
      data-testid={habit.title}
      chevron={true}
      onClick={onClick}
    />
  );
}
