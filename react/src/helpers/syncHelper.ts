import {
  LocalNotificationDescriptor,
  LocalNotifications,
  LocalNotificationSchema
} from '@capacitor/local-notifications';
import {
  activitiesKey,
  awardsKey,
  challengesKey,
  habitsKey,
  satisfactionsKey
} from 'contexts/stateHelper.context';
import _ from 'lodash';
import { Habit } from 'models/habit';
import moment from 'moment';
import { mutate } from 'swr';
import { Challenge } from 'types/types';
import NetworkHelper from './web/networkHelper';
const everyday = _.range(1, 8).map((v) => v);

export namespace SyncHelper {
  /**
   * See {@link putManyHabits}
   */
  export function putHabit(habit: Habit, skipNetwork: boolean = false) {
    return putManyHabits([habit], skipNetwork);
  }

  /**
   * Removes all DELIVERED notifications and all state information.
   * Be sure to call {@link removeNotifications} beforehand.
   */
  export async function clearState() {
    try {
      await LocalNotifications.removeAllDeliveredNotifications();
    } catch (err) {}
    await Promise.all([
      mutate(activitiesKey, () => {}, {
        optimisticData: {},
        revalidate: false
      }),
      mutate(habitsKey, () => [], {
        optimisticData: [],
        revalidate: false
      }),

      mutate(challengesKey, () => [], {
        optimisticData: {},
        revalidate: false
      }),
      mutate(satisfactionsKey, () => [], {
        optimisticData: [],
        revalidate: false
      }),
      mutate(awardsKey, () => [], {
        optimisticData: [],
        revalidate: false
      })
    ]);
  }

  /**
   * Refetches all state from the backend.
   */
  export async function refreshState() {
    console.log('Refresh state');
    await Promise.all([
      mutate(habitsKey),

      mutate(activitiesKey),
      mutate(challengesKey),
      mutate(satisfactionsKey),
      mutate(awardsKey)
    ]);
  }

  /**
   * Replaces an activity in the state.
   *
   * See {@link ActivityContainer} for how activity is stored in the state.
   *
   * Automatically updates all habits, including the related habit.
   *
   * @param act the {@link Activity} to put
   */
  // export async function putActivity(act: Activity) {
  //   act.progress = Math.max(0, act.progress);
  //   NetworkHelper.trackCompletion(
  //     act.habitID,
  //     act.progress,
  //     act.skipped || false,
  //     act.actDate
  //   );
  // const work = async (data: ActivityContainer, skip: boolean = false) => {
  //   let out = { ...(data || {}) };

  //   out[act.habitID] ??= {};

  //   out[act.habitID][act.cycle] = Activity.create(act);
  //   return out;
  // };
  // mutate(activitiesKey, (data: ActivityContainer) => work(data), {
  //   revalidate: false
  // });
  // I have no idea..
  // mutate(activitiesKey, (data: ActivityContainer) => work(data, false), {
  //   revalidate: false,
  //   rollbackOnError: true,
  //   optimisticData: (data: ActivityContainer) => work(data, true)
  // });
  // }

  function putChallenge(challenge: Challenge) {
    mutate(
      challengesKey,
      (data: Challenge[]) => {
        let out = data || [];

        const existing = out.find((h) => h.id === challenge.id);

        if (existing) {
          out = out.map((h) => (h.id === challenge.id ? challenge : h));
        } else {
          out = [...out, challenge];
        }
        return out;
      },
      {
        revalidate: false
      }
    );
  }

  /**
   * Puts (adds/replaces) a challenge in the state. Synchronizes with the backend.
   *
   * Also handles adding the challenge's habits. See {@link putManyHabits} for details
   *
   * @param challenge The challenge to add
   */
  export async function takeChallenge(challenge: Challenge) {
    await NetworkHelper.takeChallenge(challenge).then((c) => {
      if (c) {
        putChallenge(challenge);

        putManyHabits(
          c.map((hb) => Habit.createFromDatabaseHabit(hb)),
          true
        );
      }
    });
  }

  /**
   * Ends a challenge, removes its reminders/notifications and synchronizes with the backend.
   *
   * Also sets the habit's endDate to 10 years into the future if `keepHabits` is `true`
   *
   * @param challenge The challenge to end
   * @param keepHabits Whether or not to archive the Challenge's habits
   */
  export async function endChallenge(
    challenge: Challenge,
    keepHabits: boolean = false
  ) {
    challenge.active = false;

    // Let's remove the notifications
    if (!keepHabits) {
      removeNotifications(challenge.challengeHabits);
    }

    challenge.challengeHabits.forEach((c) => {
      if (keepHabits) {
        c.challengeID = '';
        c.endDate = moment().add(10, 'year').valueOf();
      } else {
        c.reminders = [];
        c.status = 'Archived';
      }
    });

    NetworkHelper.takeChallenge(challenge);
    putChallenge(challenge);
    putManyHabits(challenge.challengeHabits);
  }

  /**
   * Removes a habit from the state and synchronizes with the backend
   * @param habit the habit to remove
   */
  export async function removeHabit(habit: Habit) {
    NetworkHelper.deleteHabit(habit.id);
    removeNotifications([habit]);

    mutate(
      habitsKey,
      (data: Habit[]) => data?.filter((d: any) => d.id !== habit.id),
      {
        revalidate: false
      }
    );
  }

  /**
   * Please use this method sparingly as this can have dangerous side-effects until the app is reloaded.
   *
   * Removes notifications based off of the habit's reminders.
   * See {@link scheduleNotifications} for how reminders affect scheduling
   *
   * @param habits The habits to remove notifications for
   */
  export async function removeNotifications(habits: Habit[]) {
    const ids: LocalNotificationDescriptor[] = [];

    habits.forEach((habit) => {
      habit.reminders.forEach((reminder) => {
        (reminder.days || everyday).forEach((day) => {
          ids.push({
            id: reminder.id + day
          });
        });
      });
    });

    if (ids.length) {
      console.log('Unscheduling', ids);
      LocalNotifications.cancel({
        notifications: ids
      });
    }
  }

  /**
   * Schedules notifications on the local devices for the given Habits based on their
   * {@link Habit.reminders}. This assigns each reminder a different notification based off of
   * given day for day in `reminder.days`, `reminder.id + day`.
   *
   * This ensures that each notification will be unique and not be overwritten by another
   *
   * @param habits the habits to schedule notifications for
   */
  export async function scheduleNotifications(habits: Habit[]) {
    let notifs: LocalNotificationSchema[] = [];

    for (let i = 0; i < habits.length; i += 1) {
      const habit = habits[i];

      habit.reminders.forEach((reminder) => {
        const [time12, meridiem] = reminder.time.split(' ');
        let [hour, minute] = time12.split(':').map((s) => Number(s));
        if (meridiem === 'PM') {
          hour += 12;
        }
        // Those reminder's days or every day.
        const days = reminder.days || everyday;

        days.forEach((day) => {
          notifs.push({
            title: 'BrainFit',
            body: habit.title,
            // Add the day to the id to get a unique id
            id: reminder.id + day,
            schedule: {
              on: {
                // They're 1-indexed
                weekday: day,
                hour: hour,
                minute: minute
              }
            },
            extra: {
              habitID: habit.id
            }
          });
        });
      });
    }

    if (notifs.length) {
      console.log('Scheduling', notifs.length, 'notifications', notifs);
      await LocalNotifications.schedule({
        notifications: notifs
      });
    }
  }

  /**
   * Puts (add/replaces based on ids) multiple habits into the current application state and
   * synchronizes with the backend as necessary
   *
   * Also handles unscheduling/rescheduling/scheduling notfications for all associated habits
   *
   * @param habits the new {@link Habit}s
   * @param skipNetwork whether or not to skip the network call (sync) in creating this habits
   **/
  export async function putManyHabits(
    habits: Habit[],
    skipNetwork: boolean = false
  ) {
    if (!habits?.length) {
      return;
    }

    //  Remove all the notifications
    await removeNotifications(habits);

    const work = async (data: Habit[]) => {
      console.log('Data is ', data);
      let out = (await data) || [];

      const added = [];

      console.log('dowork', data, out, typeof data);
      for (let i = 0; i < habits.length; i++) {
        const habit = habits[i];

        const existing = out.find((h) => h.id === habit.id);

        // For now I will leave this and I am returning with a more elegant solution in the future.
        if (!skipNetwork) {
          const newHabit = await NetworkHelper.scheduleHabit(habit);
          if (newHabit) {
            if (habit.id && newHabit.ID !== habit.id) {
              habit.status = 'Archived';
              out.push(Habit.createFromDatabaseHabit(newHabit));
            } else {
              habit.id = newHabit.ID;
              habit.activities.forEach((a) => (a.habitID = habit.id));
            }
          }
        }

        if (existing) {
          out = out.map((h) => (h.id === habit.id ? habit : h));
        } else {
          out = [...out, habit];
        }

        added.push(habit);
      }
      // Filter out the blanks
      out = out.filter((o) => o.id);

      return out;
    };

    // MIND-656
    // Reverted the rendering optimizations that were targeted towards Apple devices
    await mutate(habitsKey, (data: Habit[]) => work(data), {
      revalidate: false,
      optimisticData: async (data: Habit[]) => await work(data)
    });

    // Schedule the new notification(s)
    await scheduleNotifications(habits);
  }
}
