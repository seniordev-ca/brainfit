import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function GetOnboardingData(uid) {
  const dynamodb = new DatabaseHelper();

  const result = await dynamodb.getOnboardingData(uid);
  return result.Items;
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const { uid } = await verifyIdToken(jwtToken, jwt, superagent);

    const result = await GetOnboardingData(uid);

    callback(null, lambdaResponse(200, result));
  } catch (error) {
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
