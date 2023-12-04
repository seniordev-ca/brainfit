import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function GetActivityForHabit(userID, habitID, startDate, endDate) {
  // Deprecated
  const database = new DatabaseHelper();
  console.log(database, userID, habitID, startDate, endDate);
  // const results = await database.getActivityForHabitAndDateRange(
  //   userID,
  //   habitID,
  //   startDate,
  //   endDate
  // );
  // return results.Items;
  return {};
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { habitID, startDate, endDate } = event.queryStringParameters;
    const activityItems = await GetActivityForHabit(
      user.uid,
      habitID,
      startDate,
      endDate
    );

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
