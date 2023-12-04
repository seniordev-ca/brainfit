import { Capacitor } from "@capacitor/core";
import NotificationHelper from "helpers/notificationHelper";
import storageHelper from "helpers/storageHelper";
import store from "./store";

let timeout: any;

const storeState = (data: any) => {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(async () => {
    const newState = store.getState();
    await storageHelper.save(newState);
    console.log(`saved to storage:\n${JSON.stringify(newState)}`)
  }, 350);
};

export const saveToStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  try {
    storeState(store.getState());
    return next(action);
  } catch (err) {
    console.error('save to storage middleware error', err);
    throw err;
  }
};

const addNotification = async (state: any, action: any) => {
  const platform = Capacitor.getPlatform();
  if (action.type === 'data/addNotification' && platform !== 'web') {
    const perm = await NotificationHelper.getNotificationPermissions();
    console.log('adding local notification', perm)
    if (perm === 'granted') {
      const { payload } = action;
      console.log('notification params', state.data.data.notifications.length, payload);

      if (payload.notify) {
        NotificationHelper.addNotification(state.data.data.notifications.length + 1, payload.label, payload.sublabel)
      }
    }
  }
}

export const addNotificationMiddleware = (store: any) => (next: any) => (action: any) => {
  try {
    addNotification(store.getState(), action);
    return next(action);
  } catch (err) {
    console.error('Add notification middleware error', err);
    throw err;
  }
};


// export const saveToStorage = (store: any) => (next: any) => (action: any) => {
//   storeState(store.getState());
//   return next(action);
// };

