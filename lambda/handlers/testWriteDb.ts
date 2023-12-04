import { DatabaseHelper } from '/opt/nodejs/databaseHelper';
import { lambdaResponse } from '/opt/nodejs/response';

export async function TestWriteDbLambda(id) {
  const database = new DatabaseHelper();
  return database.createTestRecord(id);
}

export const handler = async (event, context, callback) => {
  try {
    const requestId = context.awsRequestId;

    await TestWriteDbLambda(requestId);
    callback(null, lambdaResponse(201, { id: requestId }));
  } catch (error) {
    callback(null, lambdaResponse(500, { error }));
  }
};
