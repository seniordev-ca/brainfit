import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function ScheduleHabit(habit) {
  const database = new DatabaseHelper();
  return database.scheduleHabit(habit);
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');

    const user = await verifyIdToken(jwtToken, jwt, superagent);

    /** @type {import("../../react/src/types/types").SavedHabit & {userID: string}} */
    const parsedBody = JSON.parse(event.body);
    // We can treat binary habits as having a target value of 1, this is the default

    if (typeof parsedBody.targetValue === 'undefined') {
      parsedBody.targetValue = 1;
    }

    const habit = await ScheduleHabit({
      ...parsedBody,
      userID: user.uid
    });

    callback(null, lambdaResponse(200, habit));
  } catch (error) {
    console.error('What happened');
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
