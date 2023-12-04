export const updateCompletionStatus = async (databaseHelper, userID) => {
  console.log(databaseHelper, userID);
  // const dayOfWeek = new Date()
  //   .toLocaleString('en-us', { weekday: 'long' })
  //   .substring(0, 2);
  // let habits = [];
  // const habitsResult = await databaseHelper.getHabitsByDayOfWeek(
  //   userID,
  //   dayOfWeek
  // );
  // if (habitsResult.Items) {
  //   habits = habitsResult.Items;
  // }
  // let activity = [];
  // const activityResults = await databaseHelper.getActivityForDate(
  //   userID,
  //   new Date()
  // );
  // if (activityResults.Items) {
  //   activity = activityResults.Items;
  // }
  // const scheduledDailyHabitIDs = habits
  //   .filter((habit) => habit.Weekly !== 'True')
  //   .map((habit) => habit.ID);
  // let dailyTarget = 0;
  // habits.forEach((habit) => {
  //   if (habit.Weekly === 'False') {
  //     if (habit.TargetValue) {
  //       dailyTarget += habit.TargetValue;
  //     } else {
  //       dailyTarget += 1;
  //     }
  //   }
  // });
  // let currentProgress = 0;
  // let completedHabits = 0;
  // activity.forEach((entry) => {
  //   if (scheduledDailyHabitIDs.includes(entry.Habit)) {
  //     if (entry.Progress) {
  //       currentProgress += entry.Progress;
  //     } else {
  //       currentProgress += 1;
  //     }
  //     if (entry.Progress === entry.TargetValue) {
  //       completedHabits += 1;
  //     }
  //   }
  // });
  // let status = 'incomplete';
  // let percentageComplete = 0;
  // if (dailyTarget > 0) {
  //   if (currentProgress === dailyTarget) {
  //     status = 'completed';
  //   } else if (currentProgress > 0 && currentProgress < dailyTarget) {
  //     status = 'partial';
  //   }
  //   percentageComplete = currentProgress / dailyTarget;
  // }
  // const start = new Date();
  // start.setUTCHours(0, 0, 0, 0);
  // const end = new Date();
  // end.setUTCHours(23, 59, 59, 999);
  // const existingCompletionResult =
  //   await databaseHelper.getCompletionForDateRange(userID, start, end);
  // if (
  //   existingCompletionResult.Items &&
  //   existingCompletionResult.Items.length > 0
  // ) {
  //   const { ID } = existingCompletionResult.Items[0];
  //   await databaseHelper.updateCompletion(
  //     userID,
  //     status,
  //     completedHabits,
  //     scheduledDailyHabitIDs.length,
  //     percentageComplete,
  //     ID
  //   );
  // } else {
  //   await databaseHelper.updateCompletion(
  //     userID,
  //     status,
  //     completedHabits,
  //     scheduledDailyHabitIDs.length,
  //     percentageComplete
  //   );
  // }
};
