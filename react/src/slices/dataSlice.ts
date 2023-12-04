import { createSlice } from '@reduxjs/toolkit';
import { NotificationItem } from 'types/types';
import { StoreType } from '../store/store';

export type DataState = { [key: string]: any };

export const dataSlice = createSlice({
  name: 'data',
  initialState: {
    data: {
      questionnaireAnswers: [] as string[],
      notifications: [] as any[],
      appearanceOption: "system"
    }
  },
  reducers: {
    setDataFieldWithID: (state, action) => {
      const { id, value } = action.payload;
      const data = { ...state.data, [id]: value };
      return { ...state, data };
    },
    toggleCollection: (state, action) => {
      const { collectionID, fieldID } = action.payload;
      const currentData: { [key: string]: any } = state.data;
      let collection: string[] = [];

      if (currentData[collectionID]) {
        collection = [...currentData[collectionID]];
      }

      if (collection.includes(fieldID)) {
        const index = collection.indexOf(fieldID);
        collection.splice(index, 1);
      } else {
        collection.push(fieldID);
      }
      const data = { ...state.data, [collectionID]: collection };
      return { ...state, data };
    },
    addNotification: (state, action) => {
      const { ...props }: NotificationItem = action.payload;
      const { notifications } = state.data;

      let notificationData: NotificationItem[] = [...(notifications || [])];

      if (!notificationData.find((a) => a.id === props.id)) {
        notificationData = [...notificationData, { ...props }];

        // let notificationData: NotificationItem[] = [ ...notifications || [], {
        //   ...props
        // }];
      }
      const data = { ...state.data, notifications: notificationData };
      return { ...state, data };
    },
    updateNotification: (state, action) => {
      const { notificationIndex, value } = action.payload;
      let notificationData = [...state.data.notifications];
      notificationData[notificationIndex] = value;
      const data = { ...state.data, notifications: notificationData };
      return { ...state, data };
    },
    loadNotifications: (state, action) => {
      const data = { ...state.data, notifications: action.payload };
      return { ...state, data };
    },
    answerQuestion: (state, action) => {
      const { answerIndex, value } = action.payload;
      const currentData: { [key: string]: any } = state.data;
      let answers: string[] = [];

      if (currentData['questionnaireAnswers']) {
        answers = [...currentData['questionnaireAnswers']];
      }
      answers[answerIndex] = value;
      const data = { ...state.data, questionnaireAnswers: answers };
      return { ...state, data };
    },
    clearAnswers: (state) => {
      const data = { ...state.data, questionnaireAnswers: [] };
      return { ...state, data };
    },
    loadData: (state, action) => {
      return action.payload;
    },
    clearData: (state) => {
      return {
        data: {
          notifications: [],
          questionnaireAnswers: [] as string[],
          appearanceOption: "system"
        }
      };
    }
  }
});

export const {
  setDataFieldWithID,
  loadData,
  clearData,
  toggleCollection,
  answerQuestion,
  clearAnswers,
  addNotification,
  loadNotifications,
  updateNotification
} = dataSlice.actions;
export const getData = (state: StoreType): DataState => state.data;
export default dataSlice.reducer;
