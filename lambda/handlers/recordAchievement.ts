import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';
// need seperate lambdas
export async function recordAchievement(userID, achievementID) {
  const dynamodb = new DatabaseHelper();
  const response = await dynamodb.recordAchievement(userID, achievementID);

  return response;
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { achievementID } = JSON.parse(event.body);
    await recordAchievement(user.uid, achievementID);

    callback(null, lambdaResponse(200, {}));
  } catch (error) {
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
