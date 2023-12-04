import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function ClaimAward(userID, award) {
  const database = new DatabaseHelper();
  return database.claimAward(userID, award);
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');

    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const parsedBody = JSON.parse(event.body);
    const { award } = parsedBody;

    const out = await ClaimAward(user.uid, award);

    callback(null, lambdaResponse(200, out));
  } catch (error) {
    console.error('What happened');
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
