import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { mockClient } from 'aws-sdk-client-mock';
import { registerUser } from '../lambda/handlers/registerUser';

const mDynamoDB = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  mDynamoDB.reset();
});

jest.mock('firebase-admin', () => {
  return {
    // ...jest.requireActual('firebase-admin'),
    initializeApp: jest.fn()
  };
});

test('registerUser function is called successfully', async () => {
  const data = { email: 'email@test.ca' };
  const result = await registerUser('uid', JSON.stringify(data));
  expect(mDynamoDB.calls()).toHaveLength(1);
  expect(result).toBe(true);
});
