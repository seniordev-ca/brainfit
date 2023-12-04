import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function GetActivityForHabit(userID, date) {
  console.log(userID, date);
  // Deprecated
  // const database = new DatabaseHelper();

  // const results = await database.getActivityForDate(userID, date);
  // return results.Items;
  return {};
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { date } = event.queryStringParameters;
    const activityItems = await GetActivityForHabit(user.uid, date);

    callback(
      null,
      lambdaResponse(200, {
        activity: activityItems
      })
    );
  } catch (error) {
    console.log('Error');
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
