import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function GetAllSatisfactions(uid) {
  const dynamodb = new DatabaseHelper();

  const result = await dynamodb.getAllSatisfactions(uid);
  return result.Items;
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const { uid } = await verifyIdToken(jwtToken, jwt, superagent);

    const result = await GetAllSatisfactions(uid);

    callback(null, lambdaResponse(200, result));
  } catch (error) {
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
