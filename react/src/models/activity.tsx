import {
  DatabaseHabitActivity,
  HabitFrequency,
  HabitPillar
} from 'types/types';

/**
 * An Activity is responsible for representing any progress on a given cycle (period) in a habit's lifetime.
 *
 * A cycle can be expressed in the following way:
 * For example in a daily habit:
 * Day 1 would be cycle 1,
 * Day 2 would be cycle 2
 * ..and so on
 *
 * In a weekly habit:
 * Days 1-7 (Week 1) would be cycle 1
 * Every week after would be another cycle, so week 2 would be cycle 2
 * ..and so on
 *
 * In a monthly habit:
 * Days 1-30/31 wouuld be cycle 1,
 * Every month after would be another cycle, so month 2 would be cycle 2.
 */
export class Activity {
  private constructor(
    public id: string,
    public habitID: string,
    public pillars: HabitPillar[],
    public actDate: number,

    public targetValue: number,
    public progress: number,

    /**
     * Expressed as a given timeframe of this activity's validity.
     * It's calculated based off a {@link Habit}'s startDate, frequency and frequencyUnit
     */
    public cycle: number,

    public frequency: HabitFrequency,
    public frequencyCount: number,

    public breakHabit: boolean,
    public skipped?: boolean
  ) {}

  /**
   * Determines whether this Activity is complete, respective of {@link Habit.breakHabit}
   */
  get isComplete() {
    return this.breakHabit
      ? this.progress <= this.targetValue
      : this.progress >= this.targetValue;
  }

  /**
   * The percentage calculation of the progress / targetValue of the activity with a limit of 100
   */
  get completion() {
    let completion = 0;

    if (this.breakHabit) {
      completion += this.isComplete ? 100 : 0;
    } else {
      completion += Math.min(1, this.progress / this.targetValue) * 100;
    }
    return Math.round(completion);
  }

  /**
   * The same as {@link Activity.completion} but can exceed 100
   */
  get actualCompletion() {
    let completion = 0;

    if (this.breakHabit) {
      completion += this.isComplete ? 100 : 0;
    } else {
      completion += (this.progress / this.targetValue) * 100;
    }
    return Math.round(completion);
  }

  /**
   * Creates a new Activity object to ensure compatability
   *
   * @param input Rough activitiy input
   * @returns A new {@link Activity} object
   */
  static create(
    input: Omit<Activity, 'isComplete' | 'actualCompletion' | 'completion'>
  ) {
    return new Activity(
      input.id,
      input.habitID,
      input.pillars,
      input.actDate,
      input.targetValue,
      input.progress,
      input.cycle,
      input.frequency,
      input.frequencyCount,
      input.breakHabit,
      input.skipped
    );
  }
  /**
   * Creates a new Activity object to ensure compatability
   *
   * @param input {@link DatabaseHabitActivity}
   * @returns A new {@link Activity} object
   */
  static createFromDatabaseActivity(input: DatabaseHabitActivity) {
    return Activity.create({
      id: input.ID,
      actDate: input.ActDate,
      breakHabit: input.BreakHabit,
      cycle: input.CompCycle,
      progress: input.CycleProgress,
      habitID: input.HabitID,
      pillars: input.Pillars,
      frequency: input.Frequency || 'day',
      frequencyCount: input.FrequencyCount || 1,
      targetValue: input.TargetValue,
      skipped: input.Skipped
    });
  }
}
