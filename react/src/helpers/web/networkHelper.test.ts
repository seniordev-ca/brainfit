import networkHelper from './networkHelper';
import jwt_decode from 'jwt-decode';

const superagent = require('superagent');

jest.mock('superagent');
jest.mock('jwt-decode', () => jest.fn());

jest.mock('firebase/auth', () => ({
  ...jest.requireActual('firebase/auth'),
  getAuth: () => {
    return {
      currentUser: { uid: 'test-uid', getIdToken: () => 'test-token' },
      onAuthStateChanged: jest.fn()
    };
  }
}));

describe('NetworkHelper Unit Tests', () => {
  test('getFBAccessFromCode success', async () => {
    await networkHelper.getFBAccessFromCode('code');
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('revokeFBToken success', async () => {
    await networkHelper.revokeFBToken('token');
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('getFBUserProfile success', async () => {
    (jwt_decode as jest.Mock).mockImplementationOnce(() => ({
      exp: Date.now()
    }));
    await networkHelper.getFBUserProfile('token', 'refresh', 'userID');
    expect(jwt_decode).toHaveBeenCalledTimes(1);
  });

  test('registerUser success', async () => {
    await networkHelper.registerUser('email@email.com');
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('SubmitQuestionnaire data success', async () => {
    const time = new Date().toISOString();
    await networkHelper.submitQuestionnaireData({}, {}, time, time);
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('getHabitsByPillar success', async () => {
    await networkHelper.getHabitsByPillar('exercise', false);
    expect(superagent.query).toHaveBeenCalledTimes(1);
  });

  // test('scheduleHabit success', async () => {
  //   //await networkHelper.scheduleHabit('habit-one', 'exercise', 'MoWeFr 1000', 'cmsID', false, 1);
  //   expect(superagent.send).toHaveBeenCalledTimes(1);
  // })

  test('getHabitsByDay success', async () => {
    // 1 = Monday
    await networkHelper.getHabitsByDay(1);
    expect(superagent.query).toHaveBeenCalledTimes(1);
  });

  test('trackActivity success', async () => {
    await networkHelper.trackActivity('habitID', 1, Date.now());
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('getCompletionInformation success', async () => {
    const start = Date.now();
    const end = Date.now();
    await networkHelper.getCompletionInformation(start, end);
    expect(superagent.query).toHaveBeenCalledTimes(1);
  });

  test('registerForNotificationGroup success', async () => {
    await networkHelper.registerForNotificationGroup(
      'firebase-fcm-token',
      'general'
    );
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('sendNotificationToGroup success', async () => {
    await networkHelper.sendNotificationToGroup('Hello world!', 'general');
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('getActivityByHabit success', async () => {
    const start = new Date().toISOString();
    const end = new Date().toISOString();
    await networkHelper.getActivityForHabit('habit-id', start, end);
    expect(superagent.query).toHaveBeenCalledTimes(1);
  });
});

describe('NetworkHelper Error States Unit Tests', () => {
  beforeEach(() => {
    superagent.send = superagent.query = jest.fn().mockImplementation(() => {
      throw new Error('network error');
    });
  });

  test('getFBAccessFromCode fail', async () => {
    await networkHelper.getFBAccessFromCode('code');
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('revokeFBToken fail', async () => {
    await networkHelper.revokeFBToken('token');
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('getFBUserProfile fail', async () => {
    (jwt_decode as jest.Mock).mockImplementationOnce(() => ({
      exp: Date.now()
    }));
    await networkHelper.getFBUserProfile('token', 'refresh', 'userID');
    expect(jwt_decode).toHaveBeenCalledTimes(1);
  });

  test('registerUser fail', async () => {
    await networkHelper.registerUser('email@email.com');
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('SubmitQuestionnaire data failure', async () => {
    const time = new Date().toISOString();
    await networkHelper.submitQuestionnaireData({}, {}, time, time);
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('getHabitsByPillar fail', async () => {
    await networkHelper.getHabitsByPillar('exercise', false);
    expect(superagent.query).toHaveBeenCalledTimes(1);
  });

  // test('scheduleHabit fail', async () => {
  //   //await networkHelper.scheduleHabit('habit-one', 'exercise', 'MoWeFr 1000', 'cmsID', false, 1);
  //   expect(superagent.send).toHaveBeenCalledTimes(1);
  // })

  test('getHabitsByDay fail', async () => {
    // 1 = monday
    await networkHelper.getHabitsByDay(1);
    expect(superagent.query).toHaveBeenCalledTimes(1);
  });

  test('trackActivity fail', async () => {
    await networkHelper.trackActivity('habitID', 1, Date.now());
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('getCompletionInformation fail', async () => {
    const start = Date.now();
    const end = Date.now();
    await networkHelper.getCompletionInformation(start, end);
    expect(superagent.query).toHaveBeenCalledTimes(1);
  });

  test('registerForNotificationGroup fail', async () => {
    await networkHelper.registerForNotificationGroup(
      'firebase-fcm-token',
      'general'
    );
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('sendNotificationToGroup fail', async () => {
    await networkHelper.sendNotificationToGroup('Hello world!', 'general');
    expect(superagent.send).toHaveBeenCalledTimes(1);
  });

  test('getActivityForHabit fail', async () => {
    const start = new Date().toISOString();
    const end = new Date().toISOString();
    await networkHelper.getActivityForHabit('habit-id', start, end);
    expect(superagent.query).toHaveBeenCalledTimes(1);
  });
});
