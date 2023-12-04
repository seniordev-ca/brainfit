import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function GetCompletionInformation({ userID, startDate, endDate }) {
  const database = new DatabaseHelper();
  const results = await database.getCompletionForDateRange({
    userID,
    startDate,
    endDate
  });

  console.log(results);
  return results;
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { startDate, endDate } = event.queryStringParameters;
    const completionItems = await GetCompletionInformation({
      userID: user.uid,
      startDate,
      endDate
    });

    callback(null, lambdaResponse(200, completionItems || []));
  } catch (error) {
    console.log('Error');
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
