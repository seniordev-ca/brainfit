import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function DeleteManyHabits(userID, habitIDs) {
  const database = new DatabaseHelper();

  // await database.deleteActivities(userID, habitID);
  await database.deleteManyHabits(userID, habitIDs);
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { habitIDs } = JSON.parse(event.body);

    await DeleteManyHabits(user.uid, habitIDs);
    callback(null, lambdaResponse(204, {}));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
