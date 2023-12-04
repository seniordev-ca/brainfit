import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { mockClient } from 'aws-sdk-client-mock';

import { PauseHabit } from '../lambda/handlers/pauseHabit';

jest.mock('firebase-admin', () => {
  return {
    // ...jest.requireActual('firebase-admin'),
    initializeApp: jest.fn()
  };
});

const mDynamoDB = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  mDynamoDB.reset();
});

test('PauseHabit function is called successfully', async () => {
  const userid = 'uid';
  const habitID = 'habitID';
  await PauseHabit(userid, habitID);
  // Schedule and update completion status
  expect(mDynamoDB.calls()).toHaveLength(1);
});
