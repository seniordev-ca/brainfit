import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function GetHabitsByDay(userID, date) {
  /** @type {import("../layers/shared/nodejs/databaseHelper")} */
  const database = new DatabaseHelper();

  const queryResult = await database.getHabitsByDate(userID, date);

  return queryResult;
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { date } = event.queryStringParameters;
    const habits = await GetHabitsByDay(user.uid, date);

    callback(null, lambdaResponse(200, { habits }));
  } catch (error) {
    callback(null, lambdaResponse(500, { error }));
  }
};
