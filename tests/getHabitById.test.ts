import {
  DynamoDBDocumentClient,
  ExecuteStatementCommand
} from '@aws-sdk/lib-dynamodb';

import { mockClient } from 'aws-sdk-client-mock';
import { GetHabitById } from '../lambda/handlers/getHabitById';

jest.mock('firebase-admin', () => {
  return {
    // ...jest.requireActual('firebase-admin'),
    initializeApp: jest.fn()
  };
});

const mDynamoDB = mockClient(DynamoDBDocumentClient);

test('GetHabitById function is called successfully', async () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mDynamoDB.on(ExecuteStatementCommand).resolves([
    {
      ID: 'response-id'
    }
  ]);
  const habitID = 'habitid';
  const userID = 'uid';

  await GetHabitById(userID, habitID);
  expect(mDynamoDB.calls()).toHaveLength(1);
});
