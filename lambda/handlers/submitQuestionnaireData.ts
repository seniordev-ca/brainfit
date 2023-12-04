import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { verifyIdToken } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function SubmitQuestionnaireData(
  answers,
  results,
  userID,
  startTime,
  endTime
) {
  const dynamodb = new DatabaseHelper();
  await dynamodb.createQuestionnaireResponse(userID, startTime, endTime);
  const responseObject = await dynamodb.getLatestQuestionResponse(userID);
  const response = responseObject.Items ? responseObject.Items[0] : undefined;

  if (response) {
    await dynamodb.createResponseAnswers(userID, response.ID, answers);
    await dynamodb.createResponseResults(userID, response.ID, results);
  }
  return response;
}

export const handler = async (event, context, callback) => {
  try {
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    const user = await verifyIdToken(jwtToken, jwt, superagent);

    const { answers, results, startTime, endTime } = JSON.parse(event.body);
    const result = await SubmitQuestionnaireData(
      answers,
      results,
      user.uid,
      startTime,
      endTime
    );
    callback(null, lambdaResponse(204, result));
  } catch (error) {
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
