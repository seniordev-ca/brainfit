import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function SaveFitbitData(user, fitbitData) {
  const database = new DatabaseHelper();
  await database.saveHealthData(user.uid, fitbitData, 'fitbit');
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { fitbitData } = JSON.parse(event.body);
    await SaveFitbitData(user, fitbitData);

    callback(null, lambdaResponse(204, {}));
  } catch (error) {
    callback(null, lambdaResponse(500, { error }));
  }
};
