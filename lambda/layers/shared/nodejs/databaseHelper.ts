import {
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  ExecuteStatementCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import crypto from 'crypto';

dayjs.extend(duration);

const AWS_DEFAULT_REGION = 'ca-central-1';

const { AWS_STAGE } = process.env;

type HabitPillar =
  | 'Exercise'
  | 'Nutrition'
  | 'Stress Management'
  | 'Social Activity'
  | 'Sleep'
  | 'Mental Stimulation';

type SavedHabit = {
  title: string;
  pillars: HabitPillar[];
  cmsLink: string | null;

  units: string;

  targetValue: number;
  dailyDigest: boolean;
  remindMe: boolean;
  reminders: { time: string; day?: string; days?: number[]; id: number }[];

  icon: string;
  breakHabit: boolean;
  description: string;

  status: string;
  colour: string;

  id: string;

  startDate: number;
  endDate: number;

  progress: number;
  activities: HabitActivity[];

  challengeID?: string;
} & FrequencyProps;

type HabitActivity = {
  id: string;
  habitID: string;
  pillars: string;

  actDate: number;
  targetValue: number;
  breakHabit: boolean;

  cycleProgress: number;
  compCycle: number;
};

type DatabaseSavedChallenge = {
  PK: string;
  SK: string;
  ID: string;

  StartDate: number;
  EndDate: number;
  Frequency: string;

  Duration: number;

  Active: boolean;
  Description: string;
  Subtitle: string;
  HeaderImage?: string;
  DarkModeHeaderImage?: string;
  Important: boolean;
  Pillar: string;
  Title: string;
};

type BaseChallenge = {
  description: string;
  subtitle: string;
  duration: number;
  important: boolean;
  pillar: string;
  title: string;
  headerImage?: string;
  darkModeHeaderImage?: string;
};

export type Challenge = BaseChallenge & {
  id: string;
  startDate: number;
  endDate: number;
  frequency: string;
  progress: number;
  active: boolean;
  challengeHabits: string[];
};

export type FrequencyProps = {
  // The frequency, 'day', 'week', 'month'
  frequencyUnit: string;
  // Specific days (numbers, 0-6)
  frequencyDays: number[];

  // The number of frequency
  frequencyUnitQuantity: number;

  // To facilitate the specific days sort of functions
  // used in conjunction with FrequencyDays.
  // 0 means the 1st day of the month.
  frequencySpecificDay?: number;
  // For example the 1st of the month
  frequencySpecificDate?: number;
};

type DatabaseSavedHabit = {
  PK: string;
  SK: string;
  ID: string;

  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;

  CreatedAt: string;
  Title: string;
  Pillars: HabitPillar[];
  CMSLink: string;
  Deleted: boolean;
  TargetValue: number;

  Unit: string;
  HabitStatus: string;
  DailyDigest: boolean;
  Remind: boolean;
  Reminders: { time: string; day?: string; days?: number[]; id: number }[];
  Icon: string;
  BreakHabit: boolean;
  Description: string;
  Colour: string;

  FrequencyUnit: string;
  FrequencyDays: number[];

  FrequencyUnitQuantity: number;

  // To facilitate the specific days sort of functions
  // used in conjunction with FrequencyDays.
  // 0 means the 1st day of the month.
  FrequencySpecificDay: number;
  FrequencySpecificDate: number;

  StartDate: number;
  EndDate: number;

  Progress: number;

  ChallengeID: string;
};

export type DatabaseHabitActivity = {
  PK: string;
  SK: string;
  ID: string;

  GSI2PK: string;
  GSI2SK: string;

  Pillars: HabitPillar[];
  HabitID: string;
  ActDate: number;
  TargetValue: number;

  Frequency: string;
  FrequencyCount: number;

  BreakHabit: boolean;
  Skipped: boolean;

  CycleProgress: number;
  CompCycle: number;
};

type Satisfactions = { [key: string]: number };

type DatabaseSavedSatisfactions = {
  PK: string;
  SK: string;
  ID: string;

  GSI1PK: string;
  GSI1SK: string;
  GSI2PK: string;
  GSI2SK: string;

  CreatedAt: string;
  Satisfactions: Satisfactions;
};

function stringify(value) {
  const lastKey = Object.keys(value).pop();
  let objString = '';

  if (Array.isArray(value)) {
    objString += `[${value.map((v) => stringify(v)).join(',')}]`;
  } else if (typeof value === 'object') {
    objString += '{';
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];

      objString += `'${key}':${stringify(value[key])}`;
      if (key !== lastKey) {
        objString += ',';
      }
    }
    objString += '}';
  } else if (typeof value === 'string') {
    objString += `'${value.replace(/'/g, "''")}'`;
  } else if (typeof value === 'number') {
    objString += `${value}`;
  } else if (typeof value === 'boolean') {
    objString += `${value}`;
  }
  return objString;
}
// Go away nasty warning, this method may be important.
stringify({});

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

type DatabaseActivityContainer = {
  [habitID: string]: {
    [cycle: string]: DatabaseHabitActivity;
  };
};

export type DatabaseAward = {
  PK: string;
  SK: string;
  ID: string;
  ChallengeID?: string;
  Title: string;
  DateEarned: number;
  Description: string;
};

export type Award = {
  id: string;
  challengeId?: string;
  title: string;
  dateEarned: number;
  description: string;
};

export const frequencyUnitToMS = {
  day: dayjs.duration(1, 'day').asMilliseconds(),
  week: dayjs.duration(1, 'week').asMilliseconds(),
  month: dayjs.duration(1, 'month').asMilliseconds()
};

export function calculateWhichCycle({
  start,
  target,
  frequency,
  frequencyCount = 1
}: {
  start: number;
  target: number;
  frequency: string;
  frequencyCount: number;
}) {
  // Hasn't started yet.
  if (start > target) {
    return 0;
  }

  const whichFR = Math.floor(
    (target - start) / (frequencyUnitToMS[frequency] * frequencyCount)
  );

  return whichFR + 1;
}

function habitToDatabaseHabit(
  userID: string | undefined,
  habitID: string,
  habit: SavedHabit
) {
  const {
    title,
    pillars,
    cmsLink,
    targetValue,
    units,
    dailyDigest,
    remindMe,
    reminders,
    icon,
    breakHabit,
    description,
    status,
    colour,
    startDate,
    endDate,
    frequencyDays,
    frequencyUnit,
    frequencyUnitQuantity,
    frequencySpecificDay,
    frequencySpecificDate,
    progress
  } = habit;
  let frequencyDaysValue = frequencyDays.map((v) => days[v]).join(',');
  if (frequencyDaysValue.trim() === '') {
    frequencyDaysValue = 'no days';
  }

  const item: DatabaseSavedHabit = {
    PK: `${userID}#habit`,
    SK: habitID,
    ID: habitID,

    GSI1PK: `${userID}#habit`,
    GSI1SK: frequencyDaysValue,
    GSI2PK: `${userID}#habit`,
    GSI2SK: pillars.map((pillar) => pillar).join(', '),

    CreatedAt: String(new Date().getTime()),

    Title: title,
    Pillars: pillars,
    CMSLink: `${cmsLink || ''}`,
    Deleted: false,
    HabitStatus: status,
    TargetValue: targetValue,

    Unit: units,
    DailyDigest: dailyDigest,
    Remind: remindMe || false,
    Reminders: reminders,
    Icon: icon,
    BreakHabit: breakHabit,
    Description: description,
    Colour: colour,

    ChallengeID: habit.challengeID || '',

    StartDate: startDate,
    EndDate: endDate,

    FrequencyUnit: frequencyUnit,
    FrequencyDays: frequencyDays,
    FrequencyUnitQuantity: frequencyUnitQuantity || 1,

    FrequencySpecificDay: frequencySpecificDay || -1,
    FrequencySpecificDate: frequencySpecificDate || -1,

    Progress: progress || 0
  };
  return item;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function arEquals(a: any[], b: any[]) {
  if (a?.length !== b?.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

export class DatabaseHelper {
  docClient: DynamoDBDocumentClient;

  constructor() {
    this.docClient = DynamoDBDocumentClient.from(
      DatabaseHelper.newDatabaseClient()
    );
  }

  static newDatabaseClient(opts = {}) {
    if (AWS_STAGE === 'local') {
      return new DynamoDBClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        ...opts
      });
    }

    return new DynamoDBClient({
      region: AWS_DEFAULT_REGION,
      ...opts
    });
  }

  async readTestRecord(id) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-TestTable`,
      Key: { id }
    };

    return this.docClient.send(new QueryCommand(params));
  }

  async createTestRecord(requestId) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-TestTable`,
      Item: {
        id: requestId,
        message: 'test write db',
        createdAt: new Date().toISOString()
      }
    };

    return this.docClient.send(new QueryCommand(params));
  }

  // USER FUNCTIONS

  async createUserRecord(uuid, email) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      Item: {
        PK: `user_${uuid}`,
        SK: email,
        ID: `user_${uuid}`,
        Email: email,
        CreatedAt: new Date().toISOString()
      }
    };
    return this.docClient.send(new PutCommand(params));
  }

  async getUserByID(id) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      Key: {
        PK: id
      }
    };

    return this.docClient.send(new QueryCommand(params));
  }

  async getUserByEmail(email) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      KeyConditionExpression: 'SK = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    return this.docClient.send(new QueryCommand(params));
  }

  async submitOnboardingData(name, pillars, userID) {
    const responseID = `onboard_${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();

    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `${userID}#onboarding`
      },
      ScanIndexForward: false
    };

    const res = await this.docClient.send(new QueryCommand(params));
    const data = res?.Items;

    if (data && data.length > 0) {
      const params = {
        TableName: `${AWS_STAGE}-MIND-Data`,
        Key: {
          PK: `${userID}#onboarding`,
          SK: data[0].SK
        },
        UpdateExpression: 'set Onboarding = :s',
        ExpressionAttributeValues: {
          ':s': {
            name,
            pillars
          }
        }
      };
      return this.docClient.send(new UpdateCommand(params));
    }

    const item = {
      PK: `${userID}#onboarding`,
      SK: responseID,
      ID: responseID,
      GSI1PK: `${userID}#onboarding`,
      GSI1SK: createdAt,

      GSI2PK: `${userID}#onboarding`,
      GSI2SK: createdAt,

      CreatedAt: createdAt,
      Onboarding: {
        name,
        pillars
      }
    };
    const putParams = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      Item: item
    };

    await this.docClient.send(new PutCommand(putParams));
    return item;
  }

  async getOnboardingData(userID) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `${userID}#onboarding`
      },
      ScanIndexForward: false
    };

    const res = await this.docClient.send(new QueryCommand(params));
    return res;
  }

  async deleteOnboardingData(userID) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `${userID}#onboarding`
      },
      ScanIndexForward: false
    };

    const res = await this.docClient.send(new QueryCommand(params));
    const data = res?.Items;

    if (data && data.length > 0) {
      const params = {
        TableName: `${AWS_STAGE}-MIND-Data`,
        Key: {
          PK: `${userID}#satisfactions`,
          SK: data[0].SK
        }
      };
      await this.docClient.send(new DeleteCommand(params));
    }
  }

  // SATISFACTION FUNCTIONS

  async addSatisfactions(userID, satisfactions) {
    const createdAt = dayjs().startOf('day').toISOString();
    const responseID = `quest_${createdAt}`;

    const item: DatabaseSavedSatisfactions = {
      PK: `${userID}#satisfactions`,
      SK: responseID,
      ID: responseID,
      GSI1PK: `${userID}#satisfactions`,
      GSI1SK: createdAt,

      GSI2PK: `${userID}#satisfactions`,
      GSI2SK: createdAt,

      CreatedAt: createdAt,
      Satisfactions: satisfactions
    };
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      Item: item
    };

    await this.docClient.send(new PutCommand(params));
    return item;
  }

  async getAllSatisfactions(userID) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `${userID}#satisfactions`
      },
      ScanIndexForward: false
    };

    const res = await this.docClient.send(new QueryCommand(params));
    return res;
  }

  async deleteSatisfactions(userID, satisfactionsID) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      Key: {
        PK: `${userID}#satisfactions`,
        SK: satisfactionsID
      }
    };
    await this.docClient.send(new DeleteCommand(params));
  }

  async getAwards(userID: string) {
    const res = await this.execQuery<DatabaseAward>(
      `Select * from "${AWS_STAGE}-MIND-Data" WHERE PK='${userID}#awards'`
    );

    return res;
  }

  async claimAward(userID: string, award: Award) {
    const item: DatabaseAward = {
      PK: `${userID}#awards`,
      ID: award.id,
      Description: award.description,
      SK: award.id,
      DateEarned: award.dateEarned,
      ChallengeID: award.challengeId || '',
      Title: award.title
    };
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      Item: item
    };
    await this.docClient.send(new PutCommand(params));
    return item;
  }

  // QUESTIONNAIRE RESPONSE FUNCTIONS

  async createQuestionnaireResponse(userID, startTime, endTime) {
    const responseID = `quest_${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();

    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      Item: {
        PK: `${userID}#quest`,
        SK: responseID,
        ID: responseID,
        GSI1PK: `${userID}#quest`,
        GSI1SK: createdAt,
        CreatedAt: createdAt,
        StartTime: startTime,
        EndTime: endTime
      }
    };

    return this.docClient.send(new QueryCommand(params));
  }

  async getQuestionResponseByID(userID, responseID) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      KeyConditionExpression: 'PK = :pk AND SK = :responseID',
      ExpressionAttributeValues: {
        ':responseID': responseID,
        ':pk': `${userID}#quest`
      }
    };

    return this.docClient.send(new QueryCommand(params));
  }

  async getLatestQuestionResponse(userID) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `${userID}#quest`
      },
      ScanIndexForward: false,
      Limit: 1
    };

    return this.docClient.send(new QueryCommand(params));
  }

  // QUESTIONNAIRE RESPONSE ANSWER FUNCTIONS

  async createResponseAnswers(userID, responseID, answers) {
    const createdAt = new Date().toISOString();
    const tableName = `${AWS_STAGE}-MIND-Data`;

    const tables = {};
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

    return this.docClient.send(new BatchWriteCommand(params));
  }

  async getResponseAnswers(userID, responseID) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      KeyConditionExpression: 'PK = :pk AND begin_with(SK, "quest_ans_")',
      ExpressionAttributeValues: {
        ':pk': `${userID}#${responseID}`
      }
    };
    return this.docClient.send(new QueryCommand(params));
  }

  // QUESTIONNAIRE RESPONSE RESULTS FUNCTIONS

  async createResponseResults(userID, responseID, results) {
    const createdAt = new Date().toISOString();
    const tableName = `${AWS_STAGE}-MIND-Data`;

    const tables = {};
    tables[tableName] = results.map((answer) => {
      const resultID = `quest_result_${answer.pillar})}`;
      return {
        PutRequest: {
          Item: {
            PK: `${userID}#${responseID}`,
            SK: resultID,
            CreatedAt: createdAt,
            Pillar: answer.pillar,
            Value: answer.value
          }
        }
      };
    });
    const params = {
      RequestItems: tables
    };

    return this.docClient.send(new BatchWriteCommand(params));
  }

  async getResponseResults(userID, responseID) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      KeyConditionExpression: 'PK = :pk AND begin_with(SK, "quest_result_")',
      ExpressionAttributeValues: {
        ':pk': `${userID}#${responseID}`
      }
    };
    return this.docClient.send(new QueryCommand(params));
  }

  async scheduleHabit(
    habit: SavedHabit & {
      userID?: string;
    }
  ) {
    const {
      userID,
      title,
      pillars,
      cmsLink,
      targetValue,
      units,
      dailyDigest,
      remindMe,
      reminders,
      icon,
      breakHabit,
      description,
      id,
      status,
      colour,
      startDate,
      endDate,
      frequencyDays,
      frequencyUnit,
      frequencyUnitQuantity,
      frequencySpecificDay,
      frequencySpecificDate,
      progress
    } = habit;
    if (id) {
      console.log('EXISTING ID', id);
    }

    const habitID = id || `habit_${crypto.randomUUID()}`;

    let existingHabit: DatabaseSavedHabit | undefined;
    if (id) {
      existingHabit = await this.getHabitByID(userID, id);
    }
    let frequencyDaysValue = frequencyDays.map((v) => days[v]).join(',');
    if (frequencyDaysValue.trim() === '') {
      frequencyDaysValue = 'no days';
    }
    const existingIsTime =
      existingHabit && existingHabit.Unit.toLowerCase() === 'time';
    const newIsTime = units.toLowerCase() === 'time';

    const shouldFork =
      existingHabit &&
      (existingHabit.Title !== title ||
        !arEquals(existingHabit.Pillars, pillars) ||
        existingHabit.BreakHabit !== breakHabit ||
        // If any of the new units is time then it's different
        existingIsTime !== newIsTime);

    console.log(
      'Fork',
      shouldFork,
      id || 'no_id',
      habitID,
      id === habitID,

      existingHabit
        ? [
            existingHabit.Title !== title,
            !arEquals(existingHabit?.Pillars, pillars),
            existingHabit.BreakHabit !== breakHabit,
            existingIsTime !== newIsTime
          ]
        : ''
    );

    const item: DatabaseSavedHabit = {
      PK: `${userID}#habit`,
      SK: habitID,
      ID: habitID,

      GSI1PK: `${userID}#habit`,
      GSI1SK: frequencyDaysValue,
      GSI2PK: `${userID}#habit`,
      GSI2SK: pillars.map((pillar) => pillar).join(', '),

      CreatedAt: String(new Date().getTime()),

      Title: title,
      Pillars: pillars,
      CMSLink: `${cmsLink || ''}`,
      Deleted: false,
      HabitStatus: status,
      TargetValue: targetValue,

      Unit: units,
      DailyDigest: dailyDigest,
      Remind: remindMe || false,
      Reminders: reminders,
      Icon: icon,
      BreakHabit: breakHabit,
      Description: description,
      Colour: colour,

      StartDate: startDate,
      EndDate: endDate,

      FrequencyUnit: frequencyUnit,
      FrequencyDays: frequencyDays,
      FrequencyUnitQuantity: frequencyUnitQuantity || 1,

      FrequencySpecificDay: frequencySpecificDay || -1,
      FrequencySpecificDate: frequencySpecificDate || -1,

      Progress: 0,
      ChallengeID: habit.challengeID || ''
    };

    console.log(item, habit);

    if (shouldFork && existingHabit) {
      // Assign a new ID instead
      const newID = `habit_${crypto.randomUUID()}`;
      item.SK = newID;
      item.ID = newID;

      item.Progress = 0;

      // We gotta update the existing to be archived
      await this.execQuery(`
        Update "${AWS_STAGE}-MIND-Data" 
        Set HabitStatus='Archived'

        WHERE PK='${userID}#habit' AND SK='${existingHabit.ID}'
      `);
    }
    await this.docClient.send(
      new PutCommand({
        TableName: `${AWS_STAGE}-MIND-Data`,
        Item: item
      })
    );

    // We've updated the habit's target value
    // so we should recalculate its completion.
    if (
      !shouldFork &&
      userID &&
      existingHabit &&
      item.TargetValue !== existingHabit.TargetValue
    ) {
      await this.trackCompletion({
        userID,
        habit: item,
        progress,
        skipped: false,
        date: Date.now()
      });
    }
    return item;
  }

  async deleteHabit(userID, habitID) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      Key: {
        PK: `${userID}#habit`,
        SK: habitID
      }
    };
    await this.docClient.send(new DeleteCommand(params));
    await this.deleteActivities(userID, habitID);
  }

  async deleteManyHabits(userID: string, habitIDs: string[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let toDelete: any[] = [];

    const sendRequest = async () => {
      if (!toDelete.length) {
        return;
      }

      const request = {
        RequestItems: {
          [`${AWS_STAGE}-MIND-Data`]: [...toDelete]
        }
      };

      toDelete = [];

      try {
        await this.docClient.send(new BatchWriteCommand(request));
      } catch (err) {
        console.error(err);
      }
    };

    for (let i = 0; i < habitIDs.length; i += 1) {
      const habitID = habitIDs[i];

      toDelete.push({
        DeleteRequest: {
          Key: {
            PK: `${userID}#habit`,
            SK: habitID
          }
        }
      });
      this.deleteActivities(userID, habitID);

      if (toDelete.length === 25) {
        sendRequest();
      }
    }
  }

  async updateHabitStatus(userID, habitID, status) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      Key: {
        PK: `${userID}#habit`,
        SK: habitID
      },
      UpdateExpression: 'set HabitStatus = :s',
      ExpressionAttributeValues: {
        ':s': status
      }
    };
    return this.docClient.send(new UpdateCommand(params));
  }

  async getHabitByID(userID, habitID) {
    const habit = await this.execQuery<DatabaseSavedHabit>(
      `Select * from "${AWS_STAGE}-MIND-Data" WHERE PK='${userID}#habit' AND SK='${habitID}'`
    );

    return habit[0];
  }

  async getHabitsByDayOfWeek(userID, dayOfWeek) {
    const habits = await this.execQuery(
      `SELECT * from "${AWS_STAGE}-MIND-Data" WHERE PK = '${userID}#habit' AND GSI1PK = '${userID}#habit' AND contains("FrequencyDays", ${dayOfWeek})`
    );
    return habits;
  }

  async getHabitsByDate(userID, date) {
    return this.execQuery(
      `SELECT * from "${AWS_STAGE}-MIND-Data" WHERE PK = '${userID}#habit'
       AND GSI1PK = '${userID}#habit' 
       AND ${date} >= StartDate
       AND ${date} <= EndDate
       AND HabitStatus='Active'
       `
    );
  }

  async getHabitsByDateRange(userID, startDate, endDate) {
    return this.execQuery(
      `SELECT * from "${AWS_STAGE}-MIND-Data" WHERE PK = '${userID}#habit'
       AND GSI1PK = '${userID}#habit' 
       AND StartDate >= ${startDate}
       AND ${endDate} <= EndDate`
    );
  }

  async getChallenges(userID) {
    return this.execQuery(`
    SELECT * from "${AWS_STAGE}-MIND-Data" WHERE PK = '${userID}#challenge'`);
  }

  async takeChallenge(userID, challenge: Challenge, habits: SavedHabit[]) {
    console.log('Take-challenge');

    const item: DatabaseSavedChallenge = {
      PK: `${userID}#challenge`,
      SK: challenge.id,

      ID: challenge.id,
      StartDate: challenge.startDate,
      EndDate: challenge.endDate,
      Frequency: challenge.frequency,
      Active: challenge.active,

      Duration: challenge.duration,

      Description: challenge.description,
      Subtitle: challenge.subtitle || '',
      HeaderImage: challenge.headerImage || '',
      DarkModeHeaderImage: challenge.darkModeHeaderImage || '',
      Important: challenge.important,
      Pillar: challenge.pillar,
      Title: challenge.title
    };

    console.log(item);
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      Item: item
    };
    await this.docClient.send(new PutCommand(params));

    const items: {
      PutRequest: {
        Item: DatabaseSavedHabit;
      };
    }[] = [];
    const outHabits: DatabaseSavedHabit[] = [];

    for (let i = 0; i < habits.length; i += 1) {
      const habit = habits[i];
      const habitID = habit.id || `habit_${crypto.randomUUID()}`;
      const sH = habitToDatabaseHabit(userID, habitID, habit);
      outHabits.push({ ...sH, ChallengeID: challenge.id });

      items.push({
        PutRequest: {
          Item: { ...sH, ChallengeID: challenge.id }
        }
      });
      console.log({
        PutRequest: {
          Item: { ...sH, ChallengeID: challenge.id }
        }
      });
    }

    await this.docClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [`${AWS_STAGE}-MIND-Data`]: items
        }
      })
    );

    return outHabits;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async execQuery<T>(query, args?: any[]): Promise<T[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let params: any = {
      Statement: query,
      Parameters: undefined
    };
    if (args) {
      params = {
        ...params,
        Parameters: args
      };
    }
    const output = await this.docClient.send(
      new ExecuteStatementCommand(params)
    );

    return (output.Items as T[]) || [];
  }

  async getHabitsByPillar(userID, pillar) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :pk',
      FilterExpression: 'contains(Pillars, :pillar)',
      ExpressionAttributeValues: {
        ':pk': `${userID}#habit`,
        ':pillar': pillar
      }
    };
    const res = await this.docClient.send(new QueryCommand(params));

    return res;
  }

  async getAllHabits(userID) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `${userID}#habit`
      }
    };

    const res = await this.docClient.send(new QueryCommand(params));
    return res;
  }

  async getAllHabitsNew(userID) {
    const habits = await this.execQuery<DatabaseSavedHabit>(`
    SELECT * FROM "${AWS_STAGE}-MIND-Data"
    WHERE PK='${userID}#habit'
    `);

    return habits;
  }

  // TRACKING FUNCTIONS

  async trackCompletion({
    userID,
    progress,
    skipped,
    habit,
    date
  }: {
    userID: string;
    progress: number;
    skipped: boolean;
    habit: DatabaseSavedHabit;
    date: number;
  }) {
    // habitId#startOfDayTS
    const activityID = `${habit.ID}#${date}`;

    const cycleToRecord = calculateWhichCycle({
      start: habit.StartDate,
      target: date,
      frequency: habit.FrequencyUnit,
      frequencyCount: habit.FrequencyUnitQuantity
    });

    // Set the progress
    habit.Progress = progress;
    // First create and add the activity.
    const activity: DatabaseHabitActivity = {
      PK: `${userID}#act`,
      SK: activityID,
      ID: activityID,

      Pillars: habit.Pillars,

      BreakHabit: habit.BreakHabit,
      Skipped: skipped,

      GSI2PK: `${userID}#habit`,
      GSI2SK: habit.Pillars.map((pillar) => pillar).join(', '),

      HabitID: habit.ID,
      ActDate: date,

      Frequency: habit.FrequencyUnit,
      FrequencyCount: habit.FrequencyUnitQuantity,

      TargetValue: habit.TargetValue,
      CycleProgress: progress,
      CompCycle: cycleToRecord
    };

    await this.docClient.send(
      new PutCommand({
        TableName: `${AWS_STAGE}-MIND-Data`,
        Item: activity
      })
    );
    return activity;
  }

  async getHabitActivitesForUser(userID, habitID) {
    const importParams = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      FilterExpression: 'HabitID = :habit',
      ExpressionAttributeValues: {
        ':pk': `${userID}#act`,
        ':habit': habitID
      }
    };
    return this.docClient.send(new QueryCommand(importParams));
  }

  async getLatestActivitesForAllHabits(userID: string) {
    const allActivities = await this.execQuery<DatabaseHabitActivity>(
      `
        Select * From "${AWS_STAGE}-MIND-Data"
        WHERE PK='${userID}#act' 
        `
    );
    const out: DatabaseActivityContainer = {};

    for (let i = 0; i < allActivities.length; i += 1) {
      const act = allActivities[i];

      // So the way this works out if it would be for example:
      /*

      {
        "habit_abcdef": {
          // 0 would be which cycle
          "0": {...activity}
        }
      }

      */
      out[act.HabitID] ??= {};

      out[act.HabitID][String(act.CompCycle)] = act;
    }

    return out;
  }

  async getStats({
    userID,
    habitID,
    pillar,
    startDate,
    endDate,
    frequency
  }: {
    userID: string;
    habitID?: string;
    pillar?: string;
    frequency?: string;
    startDate?: number;
    endDate?: number;
  }) {
    console.log('getStats deprecated');
    console.log(userID, habitID, pillar, startDate, endDate, frequency);
    return {
      longestStreak: 0,
      currentStreak: 0,
      totalCompleted: 0,
      averageCompletion: 0,
      trends: {
        better: [],
        worse: [],
        moreData: []
      }
    };
  }

  async mergeUsers(oldUserID: string, newUserID: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let toChange: any[] = [];

    const sendRequest = async () => {
      if (!toChange.length) {
        return;
      }

      const request = {
        RequestItems: {
          [`${AWS_STAGE}-MIND-Data`]: [...toChange]
        }
      };

      toChange = [];

      try {
        await this.docClient.send(new BatchWriteCommand(request));
      } catch (err) {
        console.error(err);
      }
    };

    const doBatch = async (key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allOf = await this.execQuery<any>(`
        Select * from "${AWS_STAGE}-MIND-Data" 
        WHERE PK='${oldUserID}#${key}'
      `);
      console.log(
        'Merging',
        key,
        `${oldUserID}#${key}`,
        oldUserID,
        '=>',
        newUserID,
        allOf
      );

      for (let i = 0; i < allOf.length; i += 1) {
        // You literally cannot, all you can do is copy it over..
        // It's not worth going back to delete it tbh. I'm sure this will be scrapped come after beta.
        const item = allOf[i];
        // MIND-669
        // DynamoDB really doesn't tell you these things huh...
        if (item.GSI1PK) {
          item.GSI1PK = item.GSI1PK?.replace(oldUserID, newUserID);
        }
        if (item.GSI2PK) {
          item.GSI2PK = item.GSI2PK?.replace(oldUserID, newUserID);
        }
        if (item.PK) {
          item.PK = item.PK?.replace(oldUserID, newUserID);
        }

        console.log(item);
        toChange.push({
          PutRequest: {
            Item: item
          }
        });
        if (toChange.length === 25) {
          // I have to :-)
          /* eslint-disable no-await-in-loop */
          await sendRequest();
        }
      }

      console.log(toChange);

      if (toChange.length) {
        await sendRequest();
      }
    };

    await Promise.all([
      doBatch('habit'),
      doBatch('act'),
      doBatch('quest'),
      doBatch('comp'),
      doBatch('satisfactions'),
      doBatch('onboarding'),
      doBatch('challenge'),
      doBatch('awards')
    ]);
  }

  async clearData(userID: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let toDelete: any[] = [];

    const sendRequest = async () => {
      if (!toDelete.length) {
        return;
      }

      const request = {
        RequestItems: {
          [`${AWS_STAGE}-MIND-Data`]: [...toDelete]
        }
      };

      toDelete = [];

      try {
        await this.docClient.send(new BatchWriteCommand(request));
      } catch (err) {
        console.error(err);
      }
    };

    const doBatch = async (key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allOf = await this.execQuery<any>(`
        Select * from "${AWS_STAGE}-MIND-Data" 
        WHERE PK='${userID}#${key}'
      `);

      for (let i = 0; i < allOf.length; i += 1) {
        // You literally cannot, all you can do is copy it over..
        // It's not worth going back to delete it tbh. I'm sure this will be scrapped come after beta.
        const item = allOf[i];

        console.log('Deleting from', key, item);

        toDelete.push({
          DeleteRequest: {
            Key: {
              PK: item.PK,
              SK: item.SK
            }
          }
        });
        if (toDelete.length === 25) {
          // I have to :-)
          /* eslint-disable no-await-in-loop */
          await sendRequest();
        }
      }

      if (toDelete.length) {
        await sendRequest();
      }
    };

    await Promise.all([
      doBatch('habit'),
      doBatch('act'),
      doBatch('quest'),
      doBatch('comp'),
      doBatch('satisfactions'),
      doBatch('challenge'),
      doBatch('awards')
    ]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async deleteActivities(userID, habitID) {
    const acts =
      (await this.getHabitActivitesForUser(userID, habitID))?.Items || [];

    // This is a created type, there's no definition for it.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let toDelete: any[] = [];

    const sendRequest = async () => {
      const request = {
        RequestItems: {
          [`${AWS_STAGE}-MIND-Data`]: toDelete
        }
      };

      toDelete = [];

      return this.docClient.send(new BatchWriteCommand(request));
    };

    for (let i = 0; i < acts.length; i += 1) {
      const activity = acts[i];
      toDelete.push({
        DeleteRequest: {
          Key: {
            PK: `${userID}#act`,
            SK: activity.ID
          }
        }
      });
      if (toDelete.length === 25) {
        sendRequest();
      }
    }

    if (toDelete.length) {
      sendRequest();
    }
  }

  // Deprecated
  async getCompletionForDateRange({ userID, startDate, endDate }) {
    return this.execQuery(`
      SELECT * from "${AWS_STAGE}-MIND-Data"
      WHERE PK='${userID}#comp'

      AND CompDate BETWEEN ${startDate} AND ${endDate}
    `);
  }

  async getActivities({
    userID,
    habitID,
    startDate,
    endDate
  }: {
    userID: string;
    startDate: number;
    endDate?: number;
    habitID?: string;
  }) {
    const actvities = this.execQuery(`
      SELECT * from "${AWS_STAGE}-MIND-Data"
      WHERE PK='${userID}#act'
      AND ActDate BETWEEN ${startDate} AND ${endDate || Date.now() * 10}
      ${habitID ? `AND HabitID='${habitID}'` : ''}
    `);

    return actvities;
  }

  // ACHIEVEMENT FUNCTIONS

  async recordAchievement(userID, achievementID) {
    const earnedAt = new Date().toISOString();
    const activityID = `achieve_${crypto.randomUUID()}`;
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      Item: {
        PK: `${userID}#achieve`,
        SK: activityID,
        ID: activityID,
        GSI1PK: `${userID}#achieve`,
        GSI1SK: achievementID,
        EarnedAt: earnedAt,
        AchievementID: achievementID
      }
    };
    return this.docClient.send(new PutCommand(params));
  }

  async getAchievementsForUser(userID) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-Data`,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `${userID}#achieve`
      }
    };
    return this.docClient.send(new QueryCommand(params));
  }

  // FITBIT / HEALTHKIT FUNCTIONS
  async saveHealthData(userID, data, key) {
    const params = {
      TableName: `${AWS_STAGE}-MIND-users`,
      Key: {
        id: userID
      },
      UpdateExpression: 'set healthData.#k = :v',
      ExpressionAttributeNames: { '#k': key },
      ExpressionAttributeValues: {
        ':v': data
      }
    };
    let result;

    try {
      result = await this.docClient.send(new UpdateCommand(params));

      // result = await this.dbClient.update(params).promise();
    } catch (err) {
      await this.docClient.send(
        new UpdateCommand({
          TableName: `${AWS_STAGE}-MIND-users`,
          Key: {
            id: userID
          },
          UpdateExpression: 'set healthData = :v',
          ExpressionAttributeValues: {
            ':v': {
              fitbit: {},
              healthKit: {}
            }
          }
        })
      );

      result = await this.docClient.send(new UpdateCommand(params));
    }
    return result;
  }
}

export default DatabaseHelper;
