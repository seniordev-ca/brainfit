import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

import { mockClient } from 'aws-sdk-client-mock';
import { DeleteHabit } from '../lambda/handlers/deleteHabit';

jest.mock('firebase-admin', () => {
  return {
    // ...jest.requireActual('firebase-admin'),
    initializeApp: jest.fn()
  };
});

const mDynamoDB = mockClient(DynamoDBDocumentClient);

test('DeleteHabit function is called successfully', async () => {
  const userid = 'uid';
  const habitID = 'habitID';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mDynamoDB.on(QueryCommand).resolves(() => [
    {
      ID: 1
    }
  ]);
  await DeleteHabit(userid, habitID);
  // Delete the habit and delete the activities
  expect(mDynamoDB.calls()).toHaveLength(2);
});
