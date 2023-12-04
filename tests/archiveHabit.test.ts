import { ArchiveHabit } from '../lambda/handlers/archiveHabit';

const {
  DynamoDBDocumentClient,
  UpdateCommand
} = require('@aws-sdk/lib-dynamodb');

const { mockClient } = require('aws-sdk-client-mock');

// const { ArchiveHabit } = require('../lambda/handlers/archiveHabit');

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

test('ArchiveHabit function is called successfully', async () => {
  const userid = 'uid';
  const habitID = 'habitID';
  mDynamoDB.on(UpdateCommand).resolves();

  await ArchiveHabit(userid, habitID);
  expect(mDynamoDB.call.length).toEqual(1);
});
