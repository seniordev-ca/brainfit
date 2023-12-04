import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function DeleteHabit(userID, habitID) {
  const database = new DatabaseHelper();

  // await database.deleteActivities(userID, habitID);
  await database.deleteHabit(userID, habitID);
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { habitID } = JSON.parse(event.body);

    await DeleteHabit(user.uid, habitID);
    callback(null, lambdaResponse(204, {}));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
