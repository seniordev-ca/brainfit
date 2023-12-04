import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

async function TrackActivity(userID, habitID, progress, skipped, date) {
  /** @type {import("../layers/shared/nodejs/databaseHelper")} */

  const database = new DatabaseHelper();

  const habit = await database.getHabitByID(userID, habitID);

  return database.trackCompletion({
    userID,
    progress,
    skipped,
    habit,
    date
  });
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const { habitID, progress, date, skipped } = JSON.parse(event.body);
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const res = await TrackActivity(user.uid, habitID, progress, skipped, date);

    callback(null, lambdaResponse(200, res));
  } catch (error) {
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
