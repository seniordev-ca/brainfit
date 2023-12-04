import { getAuth } from 'firebase/auth';
import jwt_decode from 'jwt-decode';
import { Habit } from 'models/habit';
import superagent from 'superagent';
import {
  Award,
  Challenge,
  DatabaseActivityContainer,
  DatabaseAward,
  DatabaseHabitActivity,
  DatabaseSavedChallenge,
  DatabaseSavedHabit,
  FrequencyDay,
  HabitFrequency
} from 'types/types';
import { setDataFieldWithID } from '../../slices/dataSlice';
import { clearData } from '../../slices/userSlice';
import store from '../../store/store';

const Buffer = require('buffer').Buffer;

const baseURL = process.env.REACT_APP_API_URL
  ? process.env.REACT_APP_API_URL
  : 'http://localhost:3000';
const fb_client_id = process.env.REACT_APP_FITBIT_CLIENT_ID
  ? process.env.REACT_APP_FITBIT_CLIENT_ID
  : '238CQQ';
const fb_encoded_string =
  process.env.REACT_APP_FITBIT_CLIENT_ID && process.env.REACT_APP_FITBIT_SECRET
    ? Buffer.from(
        process.env.REACT_APP_FITBIT_CLIENT_ID +
          ':' +
          process.env.REACT_APP_FITBIT_SECRET
      ).toString('base64')
    : Buffer.from('238DT8:b8fc12b44a9b0ed1399fe57f1baec7ca', 'utf-8').toString(
        'base64'
      );

interface FbToken {
  name: string;
  exp: number;
}

async function getFirebaseToken() {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    // No need to force refresh it will intelligently get a fresh one if necessary.
    const token = await user.getIdToken();
    return token;
  }

  console.log(
    'Gettoken -- ',
    auth.app,
    auth.config,
    user,
    auth.tenantId,
    auth.name
  );
  return '';
}

async function refreshFbTokenIfRequired(token: string, refresh: string) {
  let payload = jwt_decode<FbToken>(token);

  if (payload.exp * 1000 < Date.now()) {
    try {
      console.log('REFRESHING TOKEN');
      const result = await superagent
        .post(`https://api.fitbit.com/oauth2/token`)
        .set('Authorization', 'Basic ' + fb_encoded_string)
        .send(
          'client_id=' +
            fb_client_id +
            'grant_type=refresh_token&refresh_token=' +
            refresh
        );

      const freshToken = result.body;
      store.dispatch(
        setDataFieldWithID({ id: 'fbToken', value: freshToken.access_token })
      );
      store.dispatch(
        setDataFieldWithID({
          id: 'fbRefreshToken',
          value: freshToken.refresh_token
        })
      );
      store.dispatch(
        setDataFieldWithID({ id: 'fbUserID', value: freshToken.user_id })
      );
      return freshToken;
    } catch (error) {
      store.dispatch(clearData());
    }
  }
  return token;
}

const NetworkHelper = {
  composeRequestURL: async (endpoint: string) => {
    return ``;
  },
  // Fitbit API calls
  getFBAccessFromCode: async (
    code: string,
    redirectUri: any = process.env.REACT_APP_FITBIT_REDIRECT_URI
  ) => {
    try {
      const result = await superagent
        .post(`https://api.fitbit.com/oauth2/token`)
        .set('Authorization', 'Basic ' + fb_encoded_string)
        .send(
          'client_id=' +
            fb_client_id +
            '&grant_type=authorization_code&code=' +
            code +
            '&redirect_uri=' +
            redirectUri
        );

      const data = result.body;
      store.dispatch(
        setDataFieldWithID({ id: 'fbToken', value: data.access_token })
      );
      store.dispatch(
        setDataFieldWithID({ id: 'fbRefreshToken', value: data.refresh_token })
      );
      store.dispatch(
        setDataFieldWithID({ id: 'fbUserID', value: data.user_id })
      );
      return data;
    } catch (error) {
      console.log(error);
      return { error };
    }
  },

  revokeFBToken: async (token: string) => {
    try {
      const result = await superagent
        .post(`https://api.fitbit.com/oauth2/revoke`)
        .set('Authorization', 'Bearer ' + token)
        .send('token=' + token);
      const data = result.body;
      store.dispatch(setDataFieldWithID({ id: 'fbToken', value: null }));
      store.dispatch(setDataFieldWithID({ id: 'fbRefreshToken', value: null }));
      store.dispatch(setDataFieldWithID({ id: 'fbUserID', value: null }));
      return data;
    } catch (error) {
      console.log(error);
      return { error };
    }
  },

  getFBUserProfile: async (token: string, refresh: string, userID: string) => {
    const freshToken = await refreshFbTokenIfRequired(token, refresh);
    try {
      const result = await superagent
        .get(`https://api.fitbit.com/1/user/${userID}/profile.json`)
        .set('Authorization', 'Bearer ' + freshToken);
      return result.body;
    } catch (error) {
      console.log(error);
      return { error };
    }
  },
  // End Fitbit API

  saveFBData: async (userData: any) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/save-fitbit-data`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({ fitbitData: JSON.stringify(userData) });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
      return { error };
    }
  },

  registerUser: async (email: string) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/register-user`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({ email: email });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  mergeUser: async (oldUserID: string) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/merge-user`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({ oldUserID: oldUserID });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  submitQuestionnaireData: async (
    answers: { [key: string]: any },
    results: { [key: string]: any },
    startTime: string,
    endTime: string
  ) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/submit-questionnaire-data`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({ answers, results, startTime, endTime });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  submitOnboardingData: async (name?: string, pillars?: any) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/submit-onboarding-data`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({
          name: name ? name : '',
          pillars
        });

      const data = result;
      return data?.body;
    } catch (error) {
      console.log(error);
    }
  },

  getOnboardingData: async () => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-onboarding-data`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json');

      const data = result?.body;
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  deleteOnboardingData: async () => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/delete-onboarding-data`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json');

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  addSatisfactions: async (satisfactions: { [key: string]: any }) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/add-satisfactions`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({ satisfactions });

      const data = result;
      return data?.body;
    } catch (error) {
      console.log(error);
    }
  },

  getAllSatisfactions: async () => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-all-satisfactions`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json');

      const data = result?.body;
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  deleteSatisfactions: async (satisfactionsID: string) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/delete-satisfactions`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({
          satisfactionsID
        });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  getAwards: async () => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-awards`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json');

      const data = result?.body;
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  getHabitsByPillar: async (pillar: string, all: boolean) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-habits-by-pillar`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .query({ pillar, all });

      const data = result.body;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  scheduleHabit: async (
    habit: Habit
  ): Promise<DatabaseSavedHabit | undefined> => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/schedule-habit`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({
          ...habit,
          habitID: (habit as any)['id'] ?? undefined,
          status: habit.status,
          progress: habit.progress || 0,
          remindMe: habit.remindMe || false
        });

      const data = result;
      return data?.body;
    } catch (error) {
      console.log(error);
    }
  },
  takeChallenge: async (
    challenge: Challenge
  ): Promise<DatabaseSavedHabit[] | undefined> => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/take-challenge`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({
          challenge: {
            ...challenge,
            challengeHabits: []
          },
          habits: challenge.challengeHabits
        });

      const data = result;
      return data?.body;
    } catch (error) {
      console.log(error);
    }
  },
  claimAward: async (award: Award): Promise<DatabaseAward | undefined> => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/claim-award`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({
          award: award
        });

      const data = result;
      return data?.body;
    } catch (error) {
      console.log(error);
    }
  },
  deleteHabit: async (habitID: string) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/delete-habit`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({
          habitID: habitID
        });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  deleteManyHabits: async (habitIDs: string[]) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/delete-many-habits`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({
          habitIDs
        });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  clearData: async () => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/clear-data`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send();

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  pauseHabit: async (habitID: string) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/pause-habit`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({
          habitID: habitID
        });
      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  archiveHabit: async (habitID: string) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/archive-habit`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({
          habitID: habitID
        });
      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  getHabitsByDay: async (dayOfWeek: FrequencyDay) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-habits-by-day`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .query({ dayOfWeek });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  getHabitsByDate: async (date: number) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-habits-by-date`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .query({ date: date });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  getHabitsByDateRange: async (startDate: number, endDate: number) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-habits-by-date-range`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .query({ startDate, endDate });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  getStatistics: async (filters: {
    habitID?: string;
    pillar?: string;
    frequency?: HabitFrequency;
    startDate?: number;
    endDate?: number;
  }) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-statistics`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .query(filters);

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  trackActivity: async (habitID: string, progress: number, date: number) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/track-activity`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({ habitID, progress, date });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
  trackCompletion: async (
    habitID: string,
    progress: number,
    skipped: boolean,
    date: number
  ): Promise<DatabaseHabitActivity> => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/track-activity`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({ habitID, progress, skipped, date });

      const data = result.body;
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  getCompletionInformation: async (startDate: number, endDate: number) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-completion-information`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .query({ startDate, endDate });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  getChallenges: async (): Promise<DatabaseSavedChallenge[] | undefined> => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-challenges`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json');
      const data = result;
      return data.body;
    } catch (error) {
      console.log(error);
    }
  },
  registerForNotificationGroup: async (
    registrationToken: string,
    notificationGroup: string
  ) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/register-for-notification-group`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({ registrationToken, notificationGroup });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  sendNotificationToGroup: async (
    message: string,
    notificationGroup: string
  ) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/send-notification-to-group`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({ message, notificationGroup });

      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  getAchievementData: async () => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-achievement`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send();
      console.log(result);
      const data = result.body;
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  recordAchievement: async (achievementID: string) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .post(`${baseURL}/record-achievement`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .send({ achievementID });
      const data = result;
      return data;
    } catch (error) {
      console.log(error);
    }
  },

  getActivityForHabit: async (
    habitID: string,
    startDate: string,
    endDate: string
  ) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-activity-for-habit`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .query({ habitID, startDate, endDate });
      const data = result.body;
      return data;
    } catch (error) {
      console.log(error);
    }
  },
  getActivity: async ({
    startDate,
    habitID,
    endDate
  }: {
    habitID?: string;
    startDate: number;
    endDate?: string;
  }): Promise<DatabaseHabitActivity[]> => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-activity`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .query({ habitID, startDate, endDate });
      const data = result.body;
      return data;
    } catch (error) {
      console.log(error);
      return [];
    }
  },
  getLatestActivitesForAllHabits:
    async (): Promise<DatabaseActivityContainer> => {
      try {
        const freshToken = await getFirebaseToken();
        const result = await superagent
          .get(`${baseURL}/get-latest-activities`)
          .set('Authorization', 'Bearer ' + freshToken)
          .set('Content-Type', 'application/json');
        const data = result.body;

        return data;
      } catch (error) {
        console.log(error);
        return {};
      }
    },
  getActivityForDate: async (date: string) => {
    try {
      const freshToken = await getFirebaseToken();
      const result = await superagent
        .get(`${baseURL}/get-activity-for-date`)
        .set('Authorization', 'Bearer ' + freshToken)
        .set('Content-Type', 'application/json')
        .query({ date });
      const data = result.body;
      return data;
    } catch (error) {
      console.log(error);
    }
  }
};

export default NetworkHelper;
