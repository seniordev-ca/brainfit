import { configureStore } from '@reduxjs/toolkit';
import dataReducer, { loadData, setDataFieldWithID } from '../slices/dataSlice';
import userReducer, { loadUser } from '../slices/userSlice';
import habitReducer from '../slices/habitSlice';
import navigationReducer, { loadNavigation } from '../slices/navigationSlice';
import { addNotificationMiddleware, saveToStorageMiddleware } from './middleware';
import storageHelper from 'helpers/storageHelper';

export type StoreType = {
  data: {};
  user: {};
  navigation: {};
  habit: {};
};

const store = configureStore({
  reducer: {
    data: dataReducer,
    user: userReducer,
    navigation: navigationReducer,
    habit: habitReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([saveToStorageMiddleware, addNotificationMiddleware])
});

storageHelper.getAll().then((data: any) => {
  if (data) {
    store.dispatch(setDataFieldWithID({ id: 'storeLoaded', value: false }));
    if (data.user) store.dispatch(loadUser(data.user));
    if (data.navigation) store.dispatch(loadNavigation(data.navigation));
    setTimeout(() => {
      if (data.data) {
        store.dispatch(loadData(data.data));
      }
      store.dispatch(setDataFieldWithID({ id: 'storeLoaded', value: true }));
    }, process.env.REACT_APP_SPLASH_SCREEN_DURATION ? parseInt(process.env.REACT_APP_SPLASH_SCREEN_DURATION) : 1200);
  }
});

export default store;