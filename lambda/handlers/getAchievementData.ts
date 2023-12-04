import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

// need seperate lambdas
export async function getAchievementData(userID) {
  const dynamodb = new DatabaseHelper();
  const responseObject = await dynamodb.getAchievementsForUser(userID);
  const response = responseObject.Items;

  return response;
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const result = await getAchievementData(user.uid);

    callback(null, lambdaResponse(200, { achievements: result }));
  } catch (error) {
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
