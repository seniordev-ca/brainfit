import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function GetHabitById(userID, habitID) {
  const database = new DatabaseHelper();

  return database.getHabitByID(userID, habitID);
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { habitID } = event.queryStringParameters;

    const res = await GetHabitById(user.uid, habitID);

    if (res) {
      callback(null, lambdaResponse(200, res));
    } else {
      callback(null, lambdaResponse(404, {}));
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
