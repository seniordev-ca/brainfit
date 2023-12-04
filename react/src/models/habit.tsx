import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import {
  calculateWhichCycle,
  contentfulPillarsToSavedPillars,
  neverEndingDate,
  statsInformation
} from 'helpers/utils';
import _ from 'lodash';
import moment from 'moment';
import {
  DatabaseSavedHabit,
  FrequencyDay,
  HabitColour,
  HabitContent,
  HabitFrequency,
  HabitPillar,
  HabitReminder,
  HabitStatus
} from 'types/types';
import { Activity } from './activity';

import * as contentful from 'contentful';
import NetworkHelper from 'helpers/web/networkHelper';

export class Habit {
  /**
   * Create a Habit given its input fieldset.
   *
   * Using the `startDate`, `endDate`, `frequencyUnit`, `frequencyUnitQuantity`,
   *
   * The {@link activities} array is prepopulated. See the {@link activities} and {@link calculateWhichCycle} for calculation details
   *
   * @param id
   * @param title
   * @param pillars
   * @param units
   * @param targetValue
   * @param dailyDigest
   * @param reminders
   * @param icon
   * @param breakHabit
   * @param description
   * @param status
   * @param colour
   * @param startDate
   * @param endDate
   * @param activities
   * @param frequencyUnit
   * @param frequencyDays
   * @param frequencyUnitQuantity
   * @param frequencySpecificDay
   * @param frequencySpecificDate
   * @param important
   * @param tips
   * @param challengeID
   * @param cmsLink
   */
  private constructor(
    public id: string,

    public title: string,
    public pillars: HabitPillar[],
    public units: string,
    public targetValue: number,
    public dailyDigest: boolean,
    public reminders: HabitReminder[],
    public icon: string,
    public breakHabit: boolean,
    public description: string,

    public status: HabitStatus,
    public colour: HabitColour,

    public startDate: number,
    public endDate: number,

    /**
     * This is a 0-indexed array based on cycles for the activites of this habit.
     * For example in a daily habit:
     * Day 1 would be cycle 1, but in this array it would be activities[0],
     * Day 2 would be cycle 2, which would be activities[1]
     * ..and so on
     *
     * In a weekly habit:
     * Days 1-7 (Week 1) would be cycle 1 which would be activities[0],
     * Every week after would be another cycle, so week 2 would be cycle 2 which would be activities[1]
     */
    public activities: Activity[],

    public frequencyUnit: HabitFrequency,
    public frequencyDays: FrequencyDay[],
    public frequencyUnitQuantity: number,
    public frequencySpecificDay: number = -1,
    public frequencySpecificDate: number = -1,

    public important?: boolean,
    public tips?: string,
    public challengeID?: string,
    public cmsLink?: string
  ) {
    const numCycles = this.currentCycle;

    const inputActs = [...activities];

    // Force start date to respect the bounds on the model level.
    this.startDate = moment(startDate).startOf(frequencyUnit).valueOf();

    // First we start off with blank array filling all those cycles...
    for (let cycle = 0; cycle < numCycles; cycle += 1) {
      // if (!this.activities[cycle]) {
      this.activities[cycle] = Activity.create({
        id: '',
        habitID: id,
        // Here we have to have the assumption that the start date is correct!
        actDate: moment(startDate).add(cycle, frequencyUnit).valueOf(),
        targetValue: targetValue,
        progress: 0,
        cycle: cycle + 1,
        breakHabit,

        frequency: this.frequencyUnit,
        frequencyCount: this.frequencyUnitQuantity,

        skipped: status === 'Paused',

        pillars: pillars
      });
      // }
    }

    // Then we take the activities and fill them in
    for (let i = 0; i < inputActs.length; i += 1) {
      const act = inputActs[i];
      // But now we don't take the activity's word for it and recalculate the cycle

      const cycle = calculateWhichCycle({
        start: moment(startDate).startOf('day').valueOf(),
        target: moment(act.actDate).startOf('day').valueOf(),
        frequency: frequencyUnit,
        frequencyCount: frequencyUnitQuantity
      });
      // console.log('input act', act, i);
      if (cycle >= 1) {
        this.activities[cycle - 1] = act;
      }
    }
  }

  /**
   * Checks whether this habit has any reminders.
   * `true` if it does, `false` if it doesn't
   */
  get remindMe() {
    return this.reminders.length > 0;
  }
  /**
   * Checks whether or not this habit is time based
   */
  get isTime() {
    return this.units.toLowerCase() === 'time';
  }

  /**
   * Checks whether or not this habit should end.
   * This is `true` if `endDate.year >= 2099`
   */
  get isNeverEnding() {
    return moment(this.endDate).year() >= 2099;
  }

  /**
   * Current value of the latest {@link Activity}'s from this habit's {@link activities} progress.
   * See {@link Activity.progress}
   */
  get progress() {
    return _.nth(this.activities, -1)?.progress || 0;
  }

  /**
   * Determines which cycle (period) this habit is currently on.
   * See {@link calculateWhichCycle} for information on how the calculation is done
   * See {@link activities} for more detail on how this works.
   */
  get currentCycle() {
    return calculateWhichCycle({
      start: this.startDate,
      target: Math.min(Date.now(), this.endDate),
      frequency: this.frequencyUnit,
      frequencyCount: this.frequencyUnitQuantity
    });
  }

  /**
   * Current value of the latest {@link Activity}'s from this habit's {@link activities} progress.
   * See {@link Activity.completion}
   */
  get completion() {
    return _.nth(this.activities, -1)?.completion || 0;
  }

  /**
   * Current value of the latest {@link Activity}'s from this habit's {@link activities} progress.
   * See {@link Activity.actualCompletion}
   */
  get actualCompletion() {
    return _.nth(this.activities, -1)?.actualCompletion || 0;
  }

  /**
   * See {@link statsInformation}
   */
  get completionStats() {
    return statsInformation([this]);
  }

  /**
   * Given a date, this function translate that date into a cycle (period) see {@link currentCycle}.
   * It takes this cycle and uses it in a 0-indexed format in relation to this habit's
   * {@link activities} and returns that member of the array.
   *
   * See {@link calculateWhichCycle} for information on how the calculation is done
   *
   * @param date The given input date
   * @returns The specific activity for that date
   */
  getActivityForDate(date: number) {
    const cycle = calculateWhichCycle({
      start: this.startDate,
      frequency: this.frequencyUnit,
      frequencyCount: this.frequencyUnitQuantity,
      target: date
    });
    return this.activities[Math.max(0, cycle - 1)];
  }

  /**
   *
   * Determines whether or not this habit {@link isScheduledFor} the speicified day and whether or not there are conditions for showing it.
   * See {@link frequencySpecificDate} and {@link frequencySpecificDay}
   * @param date
   * @returns `true` if so, `false` if not
   */
  isShowingSpecificallyForDate(date: number) {
    const when = moment(date);
    const whichNumberOfThisDay = Math.max(1, Math.floor(when.date() / 7));

    if (
      // Specific nth day i.e 2nd Saturday, 4th wednesday
      (this.frequencySpecificDate === whichNumberOfThisDay &&
        this.frequencySpecificDay === when.day()) ||
      // nth day of the month
      (this.frequencySpecificDay === -1 &&
        this.frequencySpecificDate === when.date())
    ) {
      return true;
    }
    return false;
  }

  /**
   *
   * Given a date, determine whether or not this habit was scheduled for this date. Will return false if the habit is archived however
   * @param date The given date
   * @returns `true` if scheduled, `false` if not
   *
   * This method runs in *constant time O(1)
   *
   * * frequencyDays.includes is at most an O(7) operation and no greater,
   * technically making it an O(M) where M is len(frequencyDays) but the bounds are M >= 0 <= 7
   */
  isScheduledFor(date: number) {
    const when = moment(date);
    // Is this habit active?
    if (this.status === 'Archived') {
      return false;
    }
    // Not began yet
    if (this.startDate > when.valueOf()) {
      return false;
    }
    // Ended
    if (this.endDate < when.valueOf()) {
      return false;
    }

    // Specific day and date?
    if (this.isShowingSpecificallyForDate(date)) {
      return true;
    }

    // Is it on this day? Or are there just no days selected ? (all by default)
    if (
      !this.frequencyDays.length ||
      this.frequencyDays.includes(when.day() as FrequencyDay)
    ) {
      return true;
    }

    return false;
  }

  putActivity(act: Activity) {
    NetworkHelper.trackCompletion(
      act.habitID,
      act.progress,
      act.skipped || false,
      act.actDate
    );

    this.activities[act.cycle - 1] = act;
  }

  /**
   * Creates a new Habit object to ensure compatability
   *
   * See the constructor for specific implementation details
   * @param input Rough habit input
   * @returns A new {@link Habit} object
   */
  static create(input: IHabit) {
    return new Habit(
      input.id,
      input.title,
      input.pillars,
      input.units,
      input.targetValue,
      input.dailyDigest,
      input.reminders,
      input.icon,
      input.breakHabit,
      input.description,
      input.status,
      input.colour,
      input.startDate,
      input.endDate,
      input.activities,
      input.frequencyUnit,
      input.frequencyDays,
      input.frequencyUnitQuantity,
      input.frequencySpecificDay,
      input.frequencySpecificDate,
      input.important,
      input.tips,
      input.challengeID,
      input.cmsLink
    );
  }

  /**
   * Creates a new Habit object to ensure compatability
   *
   * See the constructor for specific implementation details
   *
   * @param input {@link contentful.Entry<HabitContent>} of {@link HabitContent}
   * @returns A new {@link Habit} object
   */
  static createFromContentfulHabit(habit: contentful.Entry<HabitContent>) {
    let tempTips: string | undefined = undefined;

    if (habit.fields.tips) {
      tempTips = documentToHtmlString(habit.fields.tips);
    }

    let f: HabitFrequency = 'day';

    const frequency = habit.fields.frequency || 'day';

    if (/week/i.test(frequency)) {
      f = 'week';
    } else if (/month/i.test(frequency)) {
      f = 'month';
    }

    const pillars = contentfulPillarsToSavedPillars(habit.fields.pillar);
    let habitIcon = '';

    if (habit.fields.icon) {
      if (habit.fields.icon.includes('mdi:')) {
        habitIcon = habit.fields.icon;
      } else {
        habitIcon = `mdi:${habit.fields.icon}`;
      }
    }

    let units = 'Count';
    let targetValue = habit.fields.targetValue || 5;

    if (habit.fields.units) {
      const inUnits = habit.fields.units.toLowerCase();
      if (inUnits === 'time' || inUnits === 'times') {
        units = 'Count';
      } else if (inUnits.includes('second')) {
        units = 'Time';
      } else if (inUnits.includes('minute')) {
        units = 'Time';
        targetValue = targetValue * 60;
      } else if (inUnits.includes('hour')) {
        units = 'Time';
        targetValue = targetValue * 60 * 60;
      } else {
        units = habit.fields.units;
      }
    }

    return Habit.create({
      title: habit.fields.title,
      pillars: pillars,
      cmsLink: habit.sys.id,

      important: habit.fields.important || false,

      frequencyUnit: f,
      frequencyDays: [0, 1, 2, 3, 4, 5, 6],
      frequencyUnitQuantity: 1,

      frequencySpecificDay: -1,
      frequencySpecificDate: -1,

      startDate: moment().startOf(f).valueOf(),
      endDate: neverEndingDate,

      units: units,
      targetValue: targetValue,
      dailyDigest: false,
      reminders: [],
      icon: habitIcon,
      breakHabit: (habit.fields.wantTo || 'Build') === 'Build' ? false : true,
      description: documentToHtmlString(habit.fields.content),
      status: 'Active',
      id: '',
      colour: pillars[0],

      activities: [],
      tips: tempTips
    });
  }

  /**
   * Creates a new Habit object to ensure compatability
   *
   * See the constructor for specific implementation details
   *
   * @param input {@link DatabaseSavedHabit}
   * @returns A new {@link Habit} object
   */
  static createFromDatabaseHabit(input: DatabaseSavedHabit) {
    return Habit.create({
      id: input.ID,
      title: input.Title,
      units: input.Unit,
      breakHabit: Boolean(input.BreakHabit),
      cmsLink: input.CMSLink,
      dailyDigest: Boolean(input.DailyDigest),

      frequencyUnit: input.FrequencyUnit,
      frequencyDays: input.FrequencyDays,
      frequencyUnitQuantity: input.FrequencyUnitQuantity,

      frequencySpecificDay: input.FrequencySpecificDay || -1,
      frequencySpecificDate: input.FrequencySpecificDate || -1,

      startDate: input.StartDate,
      endDate: input.EndDate,

      pillars: input.Pillars,
      reminders: input.Reminders.map((r) => ({
        ...r,
        id: r.id || 1
      })),
      description: input.Description,
      icon: input.Icon,
      status: input.HabitStatus || 'Active',
      targetValue: input.TargetValue,
      colour: input.Colour,

      activities: [],

      challengeID: input.ChallengeID || ''
    });
  }
}

/**
 * An `interface` style proxy for the {@link Habit} object
 */
export type IHabit = Omit<
  Habit,
  | 'remindMe'
  | 'progress'
  | 'currentCycle'
  | 'completion'
  | 'actualCompletion'
  | 'isScheduledFor'
  | 'getActivityForDate'
  | 'completionStats'
  | 'isTime'
  | 'isNeverEnding'
  | 'putActivity'
  | 'isShowingSpecificallyForDate'
>;
