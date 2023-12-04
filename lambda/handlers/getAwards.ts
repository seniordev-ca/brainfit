import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function GetAwards(uid) {
  const helper = new DatabaseHelper();

  const result = await helper.getAwards(uid);
  return result;
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const { uid } = await verifyIdToken(jwtToken, jwt, superagent);

    const result = await GetAwards(uid);

    callback(null, lambdaResponse(200, result));
  } catch (error) {
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
