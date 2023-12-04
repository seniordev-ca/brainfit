/* eslint-disable import/first */
process.env.AWS_STAGE = 'test';

import {
  DynamoDBDocumentClient,
  QueryCommand,
  PutCommand,
  BatchWriteCommand,
  ExecuteStatementCommand
} from '@aws-sdk/lib-dynamodb';

import { mockClient } from 'aws-sdk-client-mock';

import { DatabaseHelper } from '../lambda/layers/shared/nodejs/databaseHelper';

jest.mock('crypto', () => ({
  // ...jest.requireActual('crypto'),
  randomUUID: () => 'test-random-uuid'
}));

jest.mock('aws-sdk', () => {
  const mDocumentClient = {
    get: jest.fn().mockReturnThis(),
    query: jest.fn().mockReturnThis(),
    put: jest.fn().mockReturnThis(),
    batchWrite: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };
  return { DynamoDB: mDynamoDB };
});

const mDynamoDB = mockClient(DynamoDBDocumentClient);

const databaseHelper = new DatabaseHelper();

type HabitPillar =
  | 'Exercise'
  | 'Nutrition'
  | 'Stress Management'
  | 'Social Activity'
  | 'Sleep'
  | 'Mental Stimulation';

describe('databaseHelper.js', () => {
  beforeAll(() => {
    // Dynamo mocks use timestamps for record creation
    // Set system time to try and sync timestamp creation
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2020, 3, 1));
  });

  beforeEach(() => {
    mDynamoDB.reset();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  describe('readTestRecord()', () => {
    it('gets a test record', async () => {
      const mResult = { Item: { id: '12345' } };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mDynamoDB.on(QueryCommand).resolvesOnce(mResult);

      const actual = await databaseHelper.readTestRecord('12345');
      expect(actual).toEqual(mResult);
      expect(mDynamoDB.call(0).args[0].input).toEqual({
        TableName: `${process.env.AWS_STAGE}-MIND-TestTable`,
        Key: {
          id: '12345'
        }
      });
    });
  });

  describe('getUserByEmail()', () => {
    beforeEach(() => {
      mDynamoDB.reset();
    });

    it('get users by email', async () => {
      const mResult = { Items: [{ email: 'test@test.ca' }], Count: 1 };

      mDynamoDB.on(QueryCommand).resolvesOnce(mResult);

      const actual = await databaseHelper.getUserByEmail('test@test.ca');

      console.log(actual);
      expect(actual).toEqual(mResult);
      expect(mDynamoDB.call(0).args[0].input).toEqual({
        TableName: `${process.env.AWS_STAGE}-MIND-Data`,
        KeyConditionExpression: 'SK = :email',
        ExpressionAttributeValues: {
          ':email': 'test@test.ca'
        }
      });
    });
  });

  describe('getUserByID()', () => {
    beforeEach(() => {
      mDynamoDB.reset();
    });

    it('get users by ID', async () => {
      const mResult = { Item: { email: 'test@test.ca', id: 'user_UUID' } };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mDynamoDB.on(QueryCommand).resolvesOnce(mResult);

      const actual = await databaseHelper.getUserByID('user_UUID');

      expect(actual).toEqual(mResult);
      expect(mDynamoDB.call(0).args[0].input).toEqual({
        TableName: `${process.env.AWS_STAGE}-MIND-Data`,
        Key: {
          PK: 'user_UUID'
        }
      });
    });
  });

  describe('createUserRecord()', () => {
    beforeEach(() => {
      mDynamoDB.reset();
    });
    it('creates a user', async () => {
      const parameters = {
        TableName: `${process.env.AWS_STAGE}-MIND-Data`,
        Item: {
          PK: 'user_UUID',
          SK: 'test@test.ca',
          ID: 'user_UUID',
          Email: 'test@test.ca',
          CreatedAt: new Date().toISOString()
        }
      };
      mDynamoDB.on(PutCommand).resolvesOnce({});

      const actual = await databaseHelper.createUserRecord(
        'UUID',
        'test@test.ca'
      );
      expect(actual).toEqual({});
      expect(mDynamoDB.call(0).args[0].input).toEqual(parameters);
    });
  });

  describe('createQuestionnaireResponse()', () => {
    it('creates a questionnaire response', async () => {
      mDynamoDB.reset();

      // const responseID = `quest_test-random-uuid`;
      const createdAt = new Date().toISOString();

      // const parameters = {
      //   TableName: `${process.env.AWS_STAGE}-MIND-Data`,
      //   Item: {
      //     PK: `user_UUID#quest`,
      //     SK: responseID,
      //     ID: responseID,
      //     GSI1PK: `user_UUID#quest`,
      //     GSI1SK: createdAt,
      //     CreatedAt: createdAt,
      //     StartTime: createdAt,
      //     EndTime: createdAt
      //   }
      // };

      mDynamoDB.on(QueryCommand).resolvesOnce({});

      const actual = await databaseHelper.createQuestionnaireResponse(
        'user_UUID',
        createdAt,
        createdAt
      );

      expect(actual).toEqual({});
      expect(mDynamoDB.calls()).toHaveLength(1);
      // expect(mDynamoDB.call(0).args[0].input).toEqual(parameters);
    });
  });

  describe('getQuestionResponseByID()', () => {
    it('get questionnaire response by response ID', async () => {
      mDynamoDB.reset();
      const userID = 'user_UUID';
      const responseID = `quest_test-random-uuid`;
      const mResult = {
        Items: [{ PK: `${userID}#quest`, SK: responseID }],
        Count: 1
      };
      mDynamoDB.on(QueryCommand).resolvesOnce(mResult);

      const actual = await databaseHelper.getQuestionResponseByID(
        userID,
        responseID
      );
      expect(actual).toEqual(mResult);
      expect(mDynamoDB.call(0).args[0].input).toEqual({
        TableName: `${process.env.AWS_STAGE}-MIND-Data`,
        KeyConditionExpression: 'PK = :pk AND SK = :responseID',
        ExpressionAttributeValues: {
          ':responseID': responseID,
          ':pk': `${userID}#quest`
        }
      });
    });
  });

  describe('getLatestQuestionResponse()', () => {
    it('get questionnaire response by response ID', async () => {
      mDynamoDB.reset();

      const userID = 'user_UUID';
      const responseID = `quest_test-random-uuid`;
      const mResult = {
        Items: [{ PK: `${userID}#quest`, SK: responseID }],
        Count: 1
      };

      mDynamoDB.on(QueryCommand).resolvesOnce(mResult);

      const actual = await databaseHelper.getLatestQuestionResponse(userID);
      expect(actual).toEqual(mResult);
      expect(mDynamoDB.call(0).args[0].input).toEqual({
        TableName: `${process.env.AWS_STAGE}-MIND-Data`,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `${userID}#quest`
        },
        ScanIndexForward: false,
        Limit: 1
      });
    });
  });

  describe('createResponseAnswers()', () => {
    it('creates a questionnaire answer', async () => {
      mDynamoDB.reset();
      const userID = 'user_UUID';
      const responseID = `quest_test-random-uuid`;
      const answers = [
        {
          questionKey: 'q1',
          value: '4'
        },
        {
          questionKey: 'q2',
          value: 'True'
        }
      ];
      const createdAt = new Date().toISOString();

      const tables = {};
      const tableName = `${process.env.AWS_STAGE}-MIND-Data`;
      tables[tableName] = answers.map((answer) => {
        const answerID = `quest_ans_${answer.questionKey})}`;
        return {
          PutRequest: {
            Item: {
              PK: `${userID}#${responseID}`,
              SK: answerID,
              CreatedAt: createdAt,
              QuestionKey: answer.questionKey,
              Value: answer.value
            }
          }
        };
      });
      const params = {
        RequestItems: tables
      };

      mDynamoDB.on(BatchWriteCommand).resolvesOnce({});
      const actual = await databaseHelper.createResponseAnswers(
        userID,
        responseID,
        answers
      );
      expect(actual).toEqual({});
      expect(mDynamoDB.call(0).args[0].input).toEqual(params);
    });
  });

  describe('getResponseAnswers()', () => {
    it('get answers from a questionnaire', async () => {
      mDynamoDB.reset();

      const userID = 'user_UUID';
      const responseID = `quest_test-random-uuid`;
      const mResult = {
        Items: [
          {
            PK: `${userID}#${responseID}`,
            SK: `quest_ans_q1`,
            QuestionKey: 'q1',
            Value: '4'
          },
          {
            PK: `${userID}#${responseID}`,
            SK: `quest_ans_q2`,
            QuestionKey: 'q2',
            Value: 'True'
          }
        ],
        Count: 2
      };
      mDynamoDB.on(QueryCommand).resolvesOnce(mResult);
      const actual = await databaseHelper.getResponseAnswers(
        userID,
        responseID
      );
      expect(actual).toEqual(mResult);
      expect(mDynamoDB.call(0).args[0].input).toEqual({
        TableName: `${process.env.AWS_STAGE}-MIND-Data`,
        KeyConditionExpression: 'PK = :pk AND begin_with(SK, "quest_ans_")',
        ExpressionAttributeValues: {
          ':pk': `${userID}#${responseID}`
        }
      });
    });
  });

  describe('createResponseResults()', () => {
    it('creates questionnaire results', async () => {
      mDynamoDB.reset();

      const userID = 'user_UUID';
      const responseID = `quest_test-random-uuid`;
      const results = [
        {
          pillar: 'exercise',
          value: '4'
        },
        {
          pillar: 'sleep',
          value: '5'
        }
      ];
      const createdAt = new Date().toISOString();

      const tables = {};
      const tableName = `${process.env.AWS_STAGE}-MIND-Data`;
      tables[tableName] = results.map((result) => {
        const resultID = `quest_result_${result.pillar})}`;
        return {
          PutRequest: {
            Item: {
              PK: `${userID}#${responseID}`,
              SK: resultID,
              CreatedAt: createdAt,
              Pillar: result.pillar,
              Value: result.value
            }
          }
        };
      });
      const params = {
        RequestItems: tables
      };

      mDynamoDB.on(BatchWriteCommand).resolvesOnce({});
      const actual = await databaseHelper.createResponseResults(
        userID,
        responseID,
        results
      );
      expect(actual).toEqual({});
      expect(mDynamoDB.call(0).args[0].input).toEqual(params);
    });
  });

  describe('getResponseResults()', () => {
    it('get results from a questionnaire', async () => {
      mDynamoDB.reset();

      const userID = 'user_UUID';
      const responseID = `quest_test-random-uuid`;
      const mResult = {
        Items: [
          {
            PK: `${userID}#${responseID}`,
            SK: `quest_result_exercise`,
            Pillar: 'exercise',
            Value: '4'
          },
          {
            PK: `${userID}#${responseID}`,
            SK: `quest_result_sleep`,
            Pillar: 'sleep',
            Value: '5'
          }
        ],
        Count: 2
      };

      mDynamoDB.on(QueryCommand).resolvesOnce(mResult);

      const actual = await databaseHelper.getResponseResults(
        userID,
        responseID
      );
      expect(actual).toEqual(mResult);
      expect(mDynamoDB.call(0).args[0].input).toEqual({
        TableName: `${process.env.AWS_STAGE}-MIND-Data`,
        KeyConditionExpression: 'PK = :pk AND begin_with(SK, "quest_result_")',
        ExpressionAttributeValues: {
          ':pk': `${userID}#${responseID}`
        }
      });
    });
  });

  describe('scheduleHabit()', () => {
    it('schedule a new habit', async () => {
      const tempPillars: HabitPillar[] = ['Exercise'];
      mDynamoDB.reset();
      const parameters = {
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
        reminders: [],
        targetValue: 100,
        status: 'Active',
        colour: 'red',

        startDate: Date.now(),
        endDate: Date.now() * 2,

        userID: '',
        completionStats: {
          averageCompletion: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalCompleted: 0
        },
        activities: []
      };
      mDynamoDB.on(ExecuteStatementCommand).resolvesOnce({
        Items: []
      });
      mDynamoDB.on(PutCommand).resolvesOnce({});
      const actual = await databaseHelper.scheduleHabit(parameters);
      expect(actual).toBeTruthy();
      // We check for the habit in its existence
      // We then put the habit
      expect(mDynamoDB.calls()).toHaveLength(2);
    });

    //   it('schedule a new custom habit', async () => {
    //     const userID = 'user_UUID';
    //     const habitID = `habit_test-random-uuid`;
    //     const createdAt = new Date().toISOString();
    //     const schedule = 'SuMoTuWeThFrSa 0930';
    //     const pillars = 'Exercise|Social';
    //     const cmsLink1 = '';
    //     const title = 'Custom Habit';

    //     const parameters = {
    //       TableName: `${process.env.AWS_STAGE}-MIND-Data`,
    //       Item: {
    //         PK: `${userID}#habit`,
    //         SK: habitID,
    //         ID: habitID,
    //         GSI1PK: `${userID}#habit`,
    //         GSI1SK: schedule,
    //         GSI2PK: `${userID}#habit`,
    //         GSI2SK: pillars,
    //         CreatedAt: createdAt,
    //         Title: title,
    //         Schedule: schedule,
    //         Pillars: pillars,
    //         CMSLink: cmsLink1,
    //         Weekly: 'False',
    //         Custom: 'True',
    //         Deleted: 'False',
    //         Frequency: 'daily',
    //         DailyDigest: false,
    //         Remind: false,
    //         TargetValue: 1,
    //         Unit: 'cm',
    //         Icon: 'icon',
    //         Description: 'brief description',
    //         BreakHabit: false
    //       }
    //     };
    //     mDynamoDB.put().promise.mockResolvedValueOnce({});
    //     const actual = await databaseHelper.scheduleHabit(
    //       userID,
    //       title,
    //       pillars,
    //       schedule,
    //       '',
    //       'daily',
    //       1,
    //       'cm',
    //       false,
    //       false,
    //       'icon',
    //       false,
    //       'brief description'
    //     );
    //     expect(actual).toEqual({});
    //     expect(mDynamoDB.put).toBeCalledWith(parameters);
    //   });
  });

  describe('getHabitByID()', () => {
    it('get habit by ID', async () => {
      mDynamoDB.reset();

      const userID = 'user_UUID';
      const habitID = 'habit_random_uuid';
      const mResult = {
        Items: [
          {
            PK: `${userID}#habit`,
            SK: habitID
          }
        ]
      };

      mDynamoDB.on(ExecuteStatementCommand).resolvesOnce(mResult);

      const actual = await databaseHelper.getHabitByID(userID, habitID);
      expect(actual).toEqual({
        PK: `${userID}#habit`,
        SK: habitID
      });
      expect(mDynamoDB.calls()).toHaveLength(1);
    });
  });

  describe('getHabitsByDayOfWeek()', () => {
    it('get scheduled habits by day of week', async () => {
      mDynamoDB.reset();

      const userID = 'user_UUID';
      const dayOfWeek = 2;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      mDynamoDB.on(ExecuteStatementCommand).resolvesOnce([]);
      const actual = await databaseHelper.getHabitsByDayOfWeek(
        userID,
        dayOfWeek
      );

      expect(actual).toEqual([]);
      expect(mDynamoDB.calls()).toHaveLength(1);
    });
  });

  describe('getHabitsByPillar()', () => {
    it('get scheduled habits by pillar', async () => {
      const userID = 'user_UUID';
      const pillar = 'Exercise';
      const mResult = {
        Items: [{}],
        Count: 1
      };

      mDynamoDB.on(QueryCommand).resolvesOnce(mResult);

      const actual = await databaseHelper.getHabitsByPillar(userID, pillar);
      expect(actual).toEqual(mResult);
      expect(mDynamoDB.call(0).args[0].input).toEqual({
        TableName: `${process.env.AWS_STAGE}-MIND-Data`,
        IndexName: 'GSI2',
        KeyConditionExpression: 'GSI2PK = :pk',
        FilterExpression: 'contains(Pillars, :pillar)',
        ExpressionAttributeValues: {
          ':pk': `${userID}#habit`,
          ':pillar': pillar
        }
      });
    });
  });

  // describe('trackActivity()', () => {
  //   it('track activity for a habit', async () => {
  //     const userID = 'user_UUID';
  //     const habitID = `habit_test-random-uuid`;
  //     const activityID = `act_test-random-uuid`;
  //     const createdAt = new Date().toISOString();
  //     const pillars = 'Exercise|Social';
  //     const title = 'Go to gym with friends';
  //     const progress = 1;
  //     const targetValue = 1;

  //     const parameters = {
  //       TableName: `${process.env.AWS_STAGE}-MIND-Data`,
  //       Item: {
  //         PK: `${userID}#act`,
  //         SK: activityID,
  //         ID: activityID,
  //         GSI1PK: `${userID}#act`,
  //         GSI1SK: createdAt,
  //         GSI2PK: `${userID}#act`,
  //         GSI2SK: habitID,
  //         CreatedAt: createdAt,
  //         Habit: habitID,
  //         Title: title,
  //         Pillars: pillars,
  //         Progress: progress,
  //         TargetValue: targetValue
  //       }
  //     };
  //     mDynamoDB.put().promise.mockResolvedValueOnce({});
  //     const actual = await databaseHelper.trackActivity(
  //       userID,
  //       habitID,
  //       activityID,
  //       title,
  //       pillars,
  //       new Date(),
  //       progress,
  //       targetValue
  //     );
  //     expect(actual).toEqual({});
  //     expect(mDynamoDB.put).toBeCalledWith(parameters);
  //   });
  // });

  describe('getActivity()', () => {
    it('get completed activity for provided date', async () => {
      const userID = 'user_UUID';
      const activityDate = new Date();
      const start = new Date(activityDate);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(activityDate);
      end.setUTCHours(23, 59, 59, 999);

      const mResult = {
        Items: [{}]
      };
      mDynamoDB.on(ExecuteStatementCommand).resolvesOnce(mResult);
      const actual = await databaseHelper.getActivities({
        userID,
        startDate: start.getTime(),
        endDate: end.getTime()
      });
      // It goes through the query function
      expect(actual).toEqual([{}]);
      expect(mDynamoDB.calls()).toHaveLength(1);
    });
  });

  // describe('getActivityForHabitAndDateRange()', () => {
  //   it('get habit activity for provided date', async () => {
  //     const userID = 'user_UUID';
  //     const habitID = 'test-habit';
  //     const activityDate = new Date();
  //     const start = new Date(activityDate);
  //     start.setHours(0, 0, 0, 0);
  //     const end = new Date(activityDate);
  //     end.setHours(23, 59, 59, 999);

  //     const mResult = {
  //       Items: [{}],
  //       Count: 1
  //     };
  //     mDynamoDB.query().promise.mockResolvedValueOnce(mResult);
  //     const actual = await databaseHelper.getActivityForHabitAndDateRange(
  //       userID,
  //       habitID,
  //       activityDate.toISOString(),
  //       activityDate.toISOString()
  //     );
  //     expect(actual).toEqual(mResult);
  //     expect(mDynamoDB.query).toBeCalledWith({
  //       TableName: `${process.env.AWS_STAGE}-MIND-Data`,
  //       IndexName: 'GSI2',
  //       KeyConditionExpression: 'GSI2PK = :pk AND GSI2SK = :sk',
  //       FilterExpression: 'GSI1SK BETWEEN :start AND :end',
  //       ExpressionAttributeValues: {
  //         ':pk': `${userID}#act`,
  //         ':sk': habitID,
  //         ':start': start.toISOString(),
  //         ':end': end.toISOString()
  //       }
  //     });
  //   });
  // });

  // describe('updateCompletion()', () => {
  //   it('update completion status for a day', async () => {
  //     const userID = 'user_UUID';
  //     const completionID = `comp_test-random-uuid`;
  //     const createdAt = new Date().toISOString();
  //     const status = 'Partial';

  //     const parameters = {
  //       TableName: `${process.env.AWS_STAGE}-MIND-Data`,
  //       Item: {
  //         PK: `${userID}#comp`,
  //         SK: completionID,
  //         ID: completionID,
  //         GSI1PK: `${userID}#comp`,
  //         GSI1SK: createdAt,
  //         CreatedAt: createdAt,
  //         Status: status,
  //         CompletedHabits: 0,
  //         NumberOfDailyHabits: 0,
  //         PercentComplete: 0
  //       }
  //     };
  //     mDynamoDB.put().promise.mockResolvedValueOnce({});
  //     const actual = await databaseHelper.updateCompletion(
  //       userID,
  //       status,
  //       0,
  //       0,
  //       0
  //     );
  //     expect(actual).toEqual({});
  //     expect(mDynamoDB.put).toBeCalledWith(parameters);
  //   });

  //   it('update completion status for an existing entry', async () => {
  //     const userID = 'user_UUID';
  //     const completionID = `comp_test-random-uuid`;
  //     const createdAt = new Date().toISOString();
  //     const status = 'Complete';

  //     const parameters = {
  //       TableName: `${process.env.AWS_STAGE}-MIND-Data`,
  //       Item: {
  //         PK: `${userID}#comp`,
  //         SK: completionID,
  //         ID: completionID,
  //         GSI1PK: `${userID}#comp`,
  //         GSI1SK: createdAt,
  //         CreatedAt: createdAt,
  //         Status: status,
  //         CompletedHabits: 1,
  //         NumberOfDailyHabits: 1,
  //         PercentComplete: 1
  //       }
  //     };
  //     mDynamoDB.put().promise.mockResolvedValueOnce({});
  //     const actual = await databaseHelper.updateCompletion(
  //       userID,
  //       status,
  //       1,
  //       1,
  //       1,
  //       completionID
  //     );
  //     expect(actual).toEqual({});
  //     expect(mDynamoDB.put).toBeCalledWith(parameters);
  //   });
  // });

  // describe('getCompletionForDateRange()', () => {
  //   it('get completion entries for a date range', async () => {
  //     const userID = 'user_UUID';
  //     const activityDate = new Date();
  //     const start = new Date(activityDate);
  //     start.setUTCHours(0, 0, 0, 0);
  //     const end = new Date(activityDate);
  //     end.setUTCHours(23, 59, 59, 999);

  //     const mResult = {
  //       Items: [{}],
  //       Count: 1
  //     };

  //     mDynamoDB.query().promise.mockResolvedValueOnce(mResult);
  //     const actual = await databaseHelper.getCompletionForDateRange(
  //       userID,
  //       start.toISOString(),
  //       end.toISOString()
  //     );
  //     expect(actual).toEqual(mResult);
  //     expect(mDynamoDB.query).toBeCalledWith({
  //       TableName: `${process.env.AWS_STAGE}-MIND-Data`,
  //       IndexName: 'GSI1',
  //       KeyConditionExpression:
  //         'GSI1PK = :pk AND GSI1SK BETWEEN :start AND :end',
  //       ExpressionAttributeValues: {
  //         ':pk': `${userID}#comp`,
  //         ':start': start.toISOString(),
  //         ':end': end.toISOString()
  //       }
  //     });
  //   });
  // });

  describe('recordAchievement()', () => {
    it('record user earning an achievement', async () => {
      const userID = 'user_UUID';
      // const achievementID = `achieve_test-random-uuid`;
      const achievementExternalID = `cms-identifier`;
      // const earnedAt = new Date().toISOString();
      // const parameters = {
      //   TableName: `${process.env.AWS_STAGE}-MIND-Data`,
      //   Item: {
      //     PK: `${userID}#achieve`,
      //     SK: achievementID,
      //     ID: achievementID,
      //     GSI1PK: `${userID}#achieve`,
      //     GSI1SK: achievementExternalID,
      //     EarnedAt: earnedAt,
      //     AchievementID: achievementExternalID
      //   }
      // };
      mDynamoDB.on(PutCommand).resolvesOnce({});

      const actual = await databaseHelper.recordAchievement(
        userID,
        achievementExternalID
      );
      expect(actual).toEqual({});
      expect(mDynamoDB.calls()).toHaveLength(1);
      // expect(mDynamoDB.call(0).args[0].input).toEqual(parameters);
    });
  });

  describe('getAchievementsForUser()', () => {
    it('get earned achievements for a user', async () => {
      const userID = 'user_UUID';

      const mResult = {
        Items: [{}],
        Count: 1
      };

      mDynamoDB.on(QueryCommand).resolvesOnce(mResult);
      const actual = await databaseHelper.getAchievementsForUser(userID);
      expect(actual).toEqual(mResult);
      expect(mDynamoDB.call(0).args[0].input).toEqual({
        TableName: `${process.env.AWS_STAGE}-MIND-Data`,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `${userID}#achieve`
        }
      });
    });
  });
});
