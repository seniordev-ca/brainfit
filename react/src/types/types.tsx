import * as contentful from 'contentful';
import { Document } from '@contentful/rich-text-types';
import { Moment } from 'moment';
import { Habit } from 'models/habit';
import { Activity } from 'models/activity';

export type HabitCollection = {
  title: contentful.EntryFields.Text;
  description: Document;
  themeImage: contentful.Asset;
  habits: contentful.Entry<HabitContent>[];
};

export interface HabitContent {
  title: contentful.EntryFields.Text;
  pillar: contentful.EntryFields.Text;
  body: Document;
  content: Document;
  icon: string;
  units?: string;
  frequency?: string;
  targetValue?: number;
  wantTo?: string;
  defaultIcon: contentful.EntryFields.Text;
  important?: boolean;
  tips?: Document;
  remindMe?: boolean;
}

export interface AboutContent {
  title: contentful.EntryFields.Text;
  body: Document;
  videoAsset: contentful.Asset;
  vimeoLink: contentful.EntryFields.Text;
  youtubeLink: contentful.EntryFields.Text;
}

export type ContentfulPost = {
  body: any;
  byline: string;
  pillar: HabitPillar;
  title: string;
  publicationDate: string;
  audioOrVideoAsset: any;
  relatedHabits: any;

  createdAt: number;
};

export interface PillarDescriptionContent {
  title: contentful.EntryFields.Text;
  description: Document;
  youtubeLink?: string;
  vimeoLink?: string;
  videoAsset?: object;
}

export interface ScheduledHabit {
  ID: string;
  Title: string;
  Pillars: string;
}

export type DatabaseHabitActivity = {
  PK: string;
  SK: string;
  ID: string;

  GSI2PK: string;
  GSI2SK: string;

  Pillars: HabitPillar[];
  HabitID: string;
  ActDate: number;
  TargetValue: number;

  Frequency: HabitFrequency;
  FrequencyCount: number;

  BreakHabit: boolean;
  Skipped: boolean;

  CycleProgress: number;
  CompCycle: number;
};

export type DatabaseActivityContainer = {
  [habitID: string]: {
    [cycle: string]: DatabaseHabitActivity;
  };
};

/**
 * A KV store of objects where:
 *
 * K = a {@link Habit} ID
 *
 * V = a KV object such that:
 *
 * V.K = a cycle that represents {@link Habit}'s cycle. This key references a {@link Activity}
 *
 * Given an example:<br>
 *
 * <code>
 * {
 *
 *  "habit123": {
 *
 *    // This is the 1th cycle
 *
 *    "1": Activity
 *
 * }
 *
 * }
 *</code>
 *
 */
export type ActivityContainer = {
  [habitID: string]: {
    [cycle: string]: Activity;
  };
};

export type HabitColour =
  | 'default'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'teal'
  | 'green'
  | 'blue'
  | 'lightBlue'
  | 'brown'
  | 'grey'
  | 'black'
  | HabitPillar;

export type HabitFrequency = 'day' | 'week' | 'month';

export type HabitStatus = 'Active' | 'Paused' | 'Archived';

/*  0 - Sunday, 1- Monday, etc..*/
export type FrequencyDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Satisfactions = {
  [key: string]: number;
};

export type DatabaseCompletionInformation = {
  PK: string;
  SK: string;
  ID: string;

  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;

  CompDate: number;
  Cycle: number;
  Frequency: HabitFrequency;
  Pillar: string;
  BreakHabit: boolean;

  Progress: number;
  TargetValue: number;
};

export type DatabaseSavedHabit = {
  PK: string;
  SK: string;
  ID: string;

  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;

  CreatedAt: string;
  Title: string;
  Pillars: HabitPillar[];
  Weekly: string;
  CMSLink: string;
  Deleted: boolean;
  TargetValue: number;

  Unit: string;
  HabitStatus: HabitStatus;
  DailyDigest: string;
  Remind: boolean;
  Reminders: {
    time: string;
    day?: string;
    days?: number[];
    id?: number;
  }[];
  Icon: string;
  BreakHabit: boolean;
  Description: string;
  Colour: HabitColour;

  // The frequency, 'day', 'week', 'month'
  FrequencyUnit: HabitFrequency;
  // Specific days (numbers, 0-6)
  FrequencyDays: FrequencyDay[];

  // The number of frequency
  FrequencyUnitQuantity: number;

  // To facilitate the specific days sort of functions
  // used in conjunction with FrequencyDays.
  // 0 means the 1st day of the month.
  FrequencySpecificDay: number;
  // For example the 1st of the month
  FrequencySpecificDate: number;

  StartDate: number;
  EndDate: number;

  Progress: number;

  ChallengeID: string;

  Important?: boolean;
  Tips?: string;
};

export type DatabaseSavedSatisfactions = {
  PK: string;
  SK: string;
  ID: string;

  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;

  CreatedAt: string;
  Satisfactions: Satisfactions;
};

/*

Couple of fields are omitted like habits, progress, duration etc they're 
just not needed.

*/
export type DatabaseSavedChallenge = {
  PK: string;
  SK: string;
  ID: string;

  StartDate: number;
  EndDate: number;
  Frequency: HabitFrequency;
  Active: boolean;

  Duration: number;

  Description: string;
  Subtitle: string;
  HeaderImage?: string;
  DarkModeHeaderImage?: string;
  Important?: boolean;
  Pillar: HabitPillar;
  Title: string;
};

export type SavedSatisfactions = {
  id: string;

  satisfactions: Satisfactions;
  createdAt: string;
};

export type SavedDates = {
  // active dates displayed in calendar
  start: Moment;
  end: Moment;
  selected: Moment;
};

export type HabitPillar =
  | 'Exercise'
  | 'Nutrition'
  | 'Stress Management'
  | 'Social Activity'
  | 'Sleep'
  | 'Mental Stimulation';

export type FrequencyProps = {
  // The frequency, 'day', 'week', 'month'
  frequencyUnit: HabitFrequency;
  // Specific days (numbers, 0-6)
  frequencyDays: FrequencyDay[];

  // The number of frequency
  frequencyUnitQuantity: number;

  // To facilitate the specific days sort of functions
  // used in conjunction with FrequencyDays.
  // 0 means the 1st day of the month.
  frequencySpecificDay?: number;
  // For example the 1st of the month
  frequencySpecificDate?: number;
};

export type HabitReminder = {
  id: number;

  time: string;
  day?: string;
  days?: number[];
};

export type DialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export type CompletionStats = {
  longestStreak: number;
  currentStreak: number;
  totalCompleted: number;
  averageCompletion: number;
};

export type Trends = {
  better: StatTrend[];
  worse: StatTrend[];
  neutral: StatTrend[];
};

export type Stats = {
  completion: CompletionStats;
  trends: Trends;
};

export type StatTrend = {
  direction: 'worse' | 'better' | 'neutral';
  pillar: string;
  change: number;
  hasNoProgress?: boolean;
  hasNoApplicableHabits?: boolean;
};

export type DatabaseAward = {
  PK: string;
  SK: string;
  ID: string;
  ChallengeID?: string;
  Title: string;
  DateEarned: number;
  Description: string;
};

export type Award = {
  id: string;
  challengeId?: string;
  title: string;
  dateEarned: number;
  description: string;
  unearnedDescription: string;
};

type BaseChallenge = {
  description: string;
  subtitle: string;
  important?: boolean;
  pillar: HabitPillar;
  title: string;
  duration: number;
  headerImage?: string;
  darkModeHeaderImage?: string;
};

export type Challenge = BaseChallenge & {
  id: string;
  startDate: number;
  endDate: number;
  frequency: HabitFrequency;
  progress: number;
  active: boolean;
  challengeHabits: Habit[];
};

export type ContentfulChallenge = BaseChallenge & {
  challengeHabits: contentful.Entry<HabitContent>[];
  headerImage: any;
  darkModeHeaderImage: any;
};

export type NotificationItem = {
  id?: any;
  title: string;
  subtitle?: string;
  notify?: boolean;
  read?: boolean;
  deleted?: boolean;
};

export type ChallengeMap = {
  Exercise: Challenge[];
  Nutrition: Challenge[];
  'Stress Management': Challenge[];
  'Social Activity': Challenge[];
  Sleep: Challenge[];
  'Mental Stimulation': Challenge[];
  important: Challenge[];
  othersImportant: Challenge[];
};

export type HabitPillarFilter = HabitPillar | 'archived' | 'all';
