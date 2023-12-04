import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function GetLatestActivitesForAllHabits(userID: string) {
  const database = new DatabaseHelper();

  return database.getLatestActivitesForAllHabits(userID);
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const activityItems = await GetLatestActivitesForAllHabits(user.uid);

    callback(null, lambdaResponse(200, activityItems));
  } catch (error) {
    console.log('Error');
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
