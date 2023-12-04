import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function DeleteSatisfactions(userID, satisfactionsID) {
  const database = new DatabaseHelper();

  await database.deleteSatisfactions(userID, satisfactionsID);
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { satisfactionsID } = JSON.parse(event.body);

    await DeleteSatisfactions(user.uid, satisfactionsID);
    callback(null, lambdaResponse(204, {}));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
