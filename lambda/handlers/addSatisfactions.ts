import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function AddSatisfactions(userID, satisfactions) {
  const dynamodb = new DatabaseHelper();
  return dynamodb.addSatisfactions(userID, satisfactions);
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { satisfactions } = JSON.parse(event.body);
    const result = await AddSatisfactions(user.uid, satisfactions);
    callback(null, lambdaResponse(200, result));
  } catch (error) {
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
