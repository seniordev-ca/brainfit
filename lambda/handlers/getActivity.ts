import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function GetActivity(query: {
  userID: string;
  startDate: number;
  endDate?: number;
  habitID?: string;
}) {
  const database = new DatabaseHelper();

  return database.getActivities(query);
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const activityItems = await GetActivity({
      userID: user.uid,
      ...event.queryStringParameters
    });

    callback(null, lambdaResponse(200, activityItems));
  } catch (error) {
    console.log('Error');
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
