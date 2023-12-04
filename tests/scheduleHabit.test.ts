import {
  DynamoDBDocumentClient,
  ExecuteStatementCommand
} from '@aws-sdk/lib-dynamodb';

import { mockClient } from 'aws-sdk-client-mock';

import { ScheduleHabit } from '../lambda/handlers/scheduleHabit';

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

const mDynamoDB = mockClient(DynamoDBDocumentClient);

type HabitPillar =
  | 'Exercise'
  | 'Nutrition'
  | 'Stress Management'
  | 'Social Activity'
  | 'Sleep'
  | 'Mental Stimulation';

test('ScheduleHabit function is called successfully', async () => {
  mDynamoDB.on(ExecuteStatementCommand).resolvesOnce({
    Items: []
  });

  const tempPillars: HabitPillar[] = ['Exercise'];
  await ScheduleHabit({
    id: 'test-habit-id',
    pillars: tempPillars,
    progress: 50,
    title: 'Habit Test',
    units: 'cm',
    breakHabit: false,
    cmsLink: '',
    dailyDigest: true,
    description: '',

    frequencyUnit: 'day',
    frequencyDays: [0, 1, 2, 3, 4, 5, 6],
    frequencyUnitQuantity: 1,

    frequencySpecificDay: -1,
    frequencySpecificDate: -1,

    icon: '',
    remindMe: true,
    targetValue: 100,
    status: 'Active',
    colour: 'red',

    startDate: Date.now(),
    endDate: Date.now() * 2
  });

  // Check for existing habit, Schedule habit
  expect(mDynamoDB.calls()).toHaveLength(2);
});
