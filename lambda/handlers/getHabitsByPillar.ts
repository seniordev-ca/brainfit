import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function GetHabitsByPillar(uid, pillar, all) {
  const dynamodb = new DatabaseHelper();

  if (all === 'true') {
    const result = await dynamodb.getAllHabitsNew(uid);
    return result;
  }

  const result = await dynamodb.getHabitsByPillar(uid, pillar);
  return result.Items;
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const { uid } = await verifyIdToken(jwtToken, jwt, superagent);

    const { all, pillar } = event.queryStringParameters;
    const result = await GetHabitsByPillar(uid, pillar, all);

    callback(null, lambdaResponse(200, result));
  } catch (error) {
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
