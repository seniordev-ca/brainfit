import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function SubmitOnboardingData(name, pillars, userID) {
  const database = new DatabaseHelper();
  return database.submitOnboardingData(name, pillars, userID);
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { name, pillars } = JSON.parse(event.body);
    const result = await SubmitOnboardingData(name, pillars, user.uid);
    callback(null, lambdaResponse(204, result));
  } catch (error) {
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
