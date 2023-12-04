import {
  DynamoDBDocumentClient,
  ExecuteStatementCommand
} from '@aws-sdk/lib-dynamodb';

import { mockClient } from 'aws-sdk-client-mock';
import { GetHabitsByDay } from '../lambda/handlers/getHabitsByDay';

// jest.mock('aws-sdk', () => {
//   const mDocumentClient = {
//     get: jest.fn().mockReturnThis(),
//     query: jest.fn().mockReturnThis(),
//     put: jest.fn().mockReturnThis(),
//     batchWrite: jest.fn().mockReturnThis(),
//     promise: jest.fn()
//   };
//   const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };
//   return { DynamoDB: mDynamoDB };
// });

jest.mock('firebase-admin', () => {
  return {
    // ...jest.requireActual('firebase-admin'),
    initializeApp: jest.fn()
  };
});

// const mDynamoDB = new AWS.DynamoDB.DocumentClient(

// );

const mDynamoDB = mockClient(DynamoDBDocumentClient);

test('GetHabitsByDay function is called successfully', async () => {
  const dayOfWeek = 'Th';
  const userID = 'uid';

  mDynamoDB.on(ExecuteStatementCommand).resolves({
    Items: []
  });

  await GetHabitsByDay(userID, dayOfWeek);

  expect(mDynamoDB.calls()).toHaveLength(1);
  // expect(mDynamoDB.query).toHaveBeenCalledTimes(1);
});
