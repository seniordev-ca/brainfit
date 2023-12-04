import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

import { mockClient } from 'aws-sdk-client-mock';

import { GetHabitsByPillar } from '../lambda/handlers/getHabitsByPillar';

jest.mock('firebase-admin', () => {
  return {
    // ...jest.requireActual('firebase-admin')
    initializeApp: jest.fn()
  };
});
const mDynamoDB = mockClient(DynamoDBDocumentClient);

test('getHabitsByPillar function is called successfully', async () => {
  const pillar = 'exercise';
  const userId = 'uid';

  mDynamoDB.on(QueryCommand).resolves({
    Items: []
  });
  await GetHabitsByPillar(userId, pillar, false);
  expect(mDynamoDB.calls()).toHaveLength(1);
});
