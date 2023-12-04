import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function TestReadDbLambda(id) {
  const database = new DatabaseHelper();
  return database.readTestRecord(id);
}

export const handler = async (event, context, callback) => {
  try {
    const { id } = event.pathParameters;

    const result = await TestReadDbLambda(id);
    callback(null, lambdaResponse(204, result));
  } catch (error) {
    callback(null, lambdaResponse(500, { error }));
  }
};
