// process.env.AWS_STAGE = 'test';

// const AWS = require('aws-sdk');
// const CompletionHelper = require('../lambda/layers/shared/nodejs/completionHelper');
// const DatabaseHelper = require('../lambda/layers/shared/nodejs/databaseHelper');

// jest.mock('crypto', () => ({
//   ...jest.requireActual('crypto'),
//   randomUUID: () => 'test-random-uuid'
// }));

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

// const mDynamoDB = new AWS.DynamoDB.DocumentClient();
// const databaseHelper = new DatabaseHelper(mDynamoDB);

// const userID = 'uid';

// const noHabitsResponse = {
//   Items: []
// };

// const habitsResponse = {
//   Items: [
//     {
//       ID: 'habit123',
//       CreatedAt: new Date(2020, 3, 1).toISOString(),
//       Title: 'habit-one',
//       Schedule: 'MoWeFr 1000',
//       Pillars: 'exercise',
//       CMSLink: `cmsID`,
//       Custom: 'False',
//       Deleted: 'False',
//       Weekly: 'False',
//       TargetValue: 1
//     },
//     {
//       ID: 'habit222',
//       CreatedAt: new Date(2020, 3, 1).toISOString(),
//       Title: 'habit-two',
//       Schedule: 'MoWeFr 1000',
//       Pillars: 'exercise',
//       CMSLink: `cmsID`,
//       Custom: 'False',
//       Deleted: 'False',
//       Weekly: 'False',
//       TargetValue: 1
//     }
//   ]
// };

// const noActivityResponse = {
//   Items: []
// };

// const matchingActivityResponse = {
//   Items: [
//     {
//       ID: 'activity123',
//       CreatedAt: new Date(2020, 3, 1).toISOString(),
//       Habit: 'habit123',
//       Title: 'habit-one',
//       Pillars: 'exercise',
//       Progress: 1,
//       TargetValue: 1
//     }
//   ]
// };

// const fullMatchingActivityResponse = {
//   Items: [
//     {
//       ID: 'activity123',
//       CreatedAt: new Date(2020, 3, 1).toISOString(),
//       Habit: 'habit123',
//       Title: 'habit-one',
//       Pillars: 'exercise',
//       Progress: 1,
//       TargetValue: 1
//     },
//     {
//       ID: 'activity222',
//       CreatedAt: new Date(2020, 3, 1).toISOString(),
//       Habit: 'habit222',
//       Title: 'habit-two',
//       Pillars: 'exercise',
//       Progress: 1,
//       TargetValue: 1
//     }
//   ]
// };

// const noCompletionResponse = {
//   Items: []
// };

// const updateCompletionParams = {
//   TableName: `${process.env.AWS_STAGE}-MIND-Data`,
//   Item: {
//     PK: `${userID}#comp`,
//     SK: 'comp_test-random-uuid',
//     ID: 'comp_test-random-uuid',
//     GSI1PK: `${userID}#comp`,
//     GSI1SK: new Date(2020, 3, 1).toISOString(),
//     CreatedAt: new Date(2020, 3, 1).toISOString(),
//     Status: 'incomplete',
//     CompletedHabits: 0,
//     NumberOfDailyHabits: 0,
//     PercentComplete: 0
//   }
// };

// const updateCompletionScheduledParams = {
//   TableName: `${process.env.AWS_STAGE}-MIND-Data`,
//   Item: {
//     PK: `${userID}#comp`,
//     SK: 'comp_test-random-uuid',
//     ID: 'comp_test-random-uuid',
//     GSI1PK: `${userID}#comp`,
//     GSI1SK: new Date(2020, 3, 1).toISOString(),
//     CreatedAt: new Date(2020, 3, 1).toISOString(),
//     Status: 'incomplete',
//     CompletedHabits: 0,
//     NumberOfDailyHabits: 2,
//     PercentComplete: 0
//   }
// };

// const updateCompletionOneCompleteParams = {
//   TableName: `${process.env.AWS_STAGE}-MIND-Data`,
//   Item: {
//     PK: `${userID}#comp`,
//     SK: 'comp_test-random-uuid',
//     ID: 'comp_test-random-uuid',
//     GSI1PK: `${userID}#comp`,
//     GSI1SK: new Date(2020, 3, 1).toISOString(),
//     CreatedAt: new Date(2020, 3, 1).toISOString(),
//     Status: 'incomplete',
//     CompletedHabits: 1,
//     NumberOfDailyHabits: 2,
//     PercentComplete: 0.5
//   }
// };

// const updateCompletionFullCompleteParams = {
//   TableName: `${process.env.AWS_STAGE}-MIND-Data`,
//   Item: {
//     PK: `${userID}#comp`,
//     SK: 'comp_test-random-uuid',
//     ID: 'comp_test-random-uuid',
//     GSI1PK: `${userID}#comp`,
//     GSI1SK: new Date(2020, 3, 1).toISOString(),
//     CreatedAt: new Date(2020, 3, 1).toISOString(),
//     Status: 'incomplete',
//     CompletedHabits: 2,
//     NumberOfDailyHabits: 2,
//     PercentComplete: 1
//   }
// };

// describe('CompletionHelper', () => {
//   describe('updateCompletionStatus()', () => {
//     beforeAll(() => {
//       // Dynamo mocks use timestamps for record creation
//       // Set system time to try and sync timestamp creation
//       jest.useFakeTimers('modern');
//       jest.setSystemTime(new Date(2020, 3, 1));
//     });

//     afterEach(() => {
//       jest.clearAllMocks();
//     });

//     afterAll(() => {
//       jest.useRealTimers();
//       jest.resetAllMocks();
//     });

//     it('should store incomplete if no habits or activity', async () => {
//       mDynamoDB.query().promise.mockResolvedValueOnce(noHabitsResponse);
//       mDynamoDB.query().promise.mockResolvedValueOnce(noActivityResponse);
//       mDynamoDB.query().promise.mockResolvedValueOnce(noCompletionResponse);

//       await CompletionHelper.updateCompletionStatus(databaseHelper, userID);
//       expect(mDynamoDB.put).toBeCalledWith(updateCompletionParams);
//     });

//     it('should store incomplete if habits but no activity', async () => {
//       mDynamoDB.query().promise.mockResolvedValueOnce(habitsResponse);
//       mDynamoDB.query().promise.mockResolvedValueOnce(noActivityResponse);
//       mDynamoDB.query().promise.mockResolvedValueOnce(noCompletionResponse);

//       await CompletionHelper.updateCompletionStatus(databaseHelper, userID);
//       expect(mDynamoDB.put).toBeCalledWith(updateCompletionScheduledParams);
//     });

//     it('should store partial if one of two habits has activity', async () => {
//       mDynamoDB.query().promise.mockResolvedValueOnce(habitsResponse);
//       mDynamoDB.query().promise.mockResolvedValueOnce(matchingActivityResponse);
//       mDynamoDB.query().promise.mockResolvedValueOnce(noCompletionResponse);

//       await CompletionHelper.updateCompletionStatus(databaseHelper, userID);

//       const params = {
//         TableName: `${process.env.AWS_STAGE}-MIND-Data`,
//         Item: {
//           ...updateCompletionOneCompleteParams.Item,
//           Status: 'partial'
//         }
//       };
//       expect(mDynamoDB.put).toBeCalledWith(params);
//     });

//     it('should store complete if all habits have activity', async () => {
//       mDynamoDB.query().promise.mockResolvedValueOnce(habitsResponse);
//       mDynamoDB
//         .query()
//         .promise.mockResolvedValueOnce(fullMatchingActivityResponse);
//       mDynamoDB.query().promise.mockResolvedValueOnce(noCompletionResponse);

//       await CompletionHelper.updateCompletionStatus(databaseHelper, userID);

//       const params = {
//         TableName: `${process.env.AWS_STAGE}-MIND-Data`,
//         Item: {
//           ...updateCompletionFullCompleteParams.Item,
//           Status: 'completed'
//         }
//       };
//       expect(mDynamoDB.put).toBeCalledWith(params);
//     });
//   });
// });

describe('CompletionHelper Tests', () => {
  it('Shoulld pass', () => {
    //
  });
});
