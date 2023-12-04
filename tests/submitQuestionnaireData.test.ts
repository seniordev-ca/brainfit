import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

import { mockClient } from 'aws-sdk-client-mock';

import { SubmitQuestionnaireData } from '../lambda/handlers/submitQuestionnaireData';

jest.mock('firebase-admin', () => {
  return {
    // ...jest.requireActual('firebase-admin'),
    initializeApp: jest.fn()
  };
});

const mDynamoDB = mockClient(DynamoDBDocumentClient);

test('SubmitQuestionnaireData function is called successfully', async () => {
  const time = new Date().toISOString();
  const userID = 'uid';
  const answers = [
    {
      questionKey: 'question1',
      value: '5'
    }
  ];
  const results = [
    {
      pillar: 'exercise',
      value: '5'
    }
  ];

  mDynamoDB.onAnyCommand().resolves({
    Items: [{ ID: 'response-id' }]
  });
  await SubmitQuestionnaireData(answers, results, userID, time, time);

  // create, latest, answers, results
  expect(mDynamoDB.calls()).toHaveLength(4);
});
