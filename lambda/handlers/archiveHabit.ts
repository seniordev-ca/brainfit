import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function ArchiveHabit(userID, habitID) {
  const database = new DatabaseHelper();

  await database.updateHabitStatus(userID, habitID, 'Archived');
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { habitID } = JSON.parse(event.body);

    await ArchiveHabit(user.uid, habitID);
    callback(null, lambdaResponse(204, {}));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
