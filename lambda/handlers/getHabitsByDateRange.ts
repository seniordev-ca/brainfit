import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function getHabitsByDateRange(userID, startDate, endDate) {
  /** @type {import("../layers/shared/nodejs/databaseHelper")} */
  const database = new DatabaseHelper();

  const queryResult = await database.getHabitsByDateRange(
    userID,
    startDate,
    endDate
  );

  return queryResult;
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { startDate, endDate } = event.queryStringParameters;
    const habits = await getHabitsByDateRange(user.uid, startDate, endDate);

    callback(null, lambdaResponse(200, { habits }));
  } catch (error) {
    callback(null, lambdaResponse(500, { error }));
  }
};
