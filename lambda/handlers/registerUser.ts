import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function registerUser(uid, data) {
  const dynamodb = new DatabaseHelper();
  data = JSON.parse(data);

  await dynamodb.createUserRecord(uid, data.email);
  return true;
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const result = await registerUser(user.uid, event.body);

    callback(null, lambdaResponse(204, result));
  } catch (error) {
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
