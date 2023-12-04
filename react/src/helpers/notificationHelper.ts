import { FCM } from '@capacitor-community/fcm';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { PushNotifications } from '@capacitor/push-notifications';
import { IOSSettings, NativeSettings } from 'capacitor-native-settings';
import NetworkHelper from './web/networkHelper';

const NotificationHelper = {
  addListeners: async () => {
    await PushNotifications.addListener('registration', (token) => {
      console.info('Registration token: ', token.value);

      FCM.getToken().then((result) => {
        NetworkHelper.registerForNotificationGroup(result.token, 'general');
      });
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Push notification received: ', notification);
      }
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification) => {
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.inputValue
        );
      }
    );

    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        console.log(notificationAction.notification);

        if (notificationAction.notification.extra?.habitID) {
          window.location.href = `/selected/${notificationAction.notification.extra?.habitID}`;
        }
      }
    );
  },

  getNotificationPermissions: async () => {
    let permStatus = await PushNotifications.checkPermissions();
    return permStatus.receive;
  },

  registerNotifications: async () => {
    const platform = Capacitor.getPlatform();
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    } else if (permStatus.receive === 'denied') {
      if (platform === 'ios') {
        alert(`Please enable notifications from the App's settings`);
        NativeSettings.openIOS({ option: IOSSettings.App });
      } else {
        permStatus = await PushNotifications.requestPermissions();
      }
    }

    if (permStatus.receive !== 'granted') {
      // throw new Error('User denied permissions!');
      return permStatus;
    }

    await PushNotifications.register();
  },

  getDeliveredNotifications: async () => {
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  },

  scheduleHabitNotificationWithSchedule: async (
    habitID: string,
    title: string,
    schedule: string
  ) => {
    const dayIndex = ['', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const [days, time] = schedule.split(' ');
    const [hours, minutes] = time.split(':');
    const daysOfWeek = days.match(/.{2}/g);

    daysOfWeek
      ?.map((day) => dayIndex.indexOf(day))
      .forEach((weekday) => {
        LocalNotifications.schedule({
          notifications: [
            {
              title: 'BrainFit',
              body: title,
              id: new Date().getTime() + weekday,
              schedule: {
                on: {
                  weekday,
                  hour: parseInt(hours),
                  minute: parseInt(minutes)
                }
              },
              extra: {
                habitID
              }
            }
          ]
        });
      });
  },

  addNotification: async (
    notificationIndex: number,
    title: string,
    subtitle: string
  ) => {
    const now = new Date();
    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'BrainFit',
            body: title,
            id: new Date().getTime(),
            schedule: {
              at: new Date(now.getTime() + 20 * 1000)
            },
            extra: {
              notificationIndex
            }
          }
        ]
      });
    } catch (err) {
      console.error('Local notification helper error', err);
    }
  },

  cancelLocalNotificationForHabit: async (habitID: string) => {
    const data = await LocalNotifications.getPending();

    if (data.notifications) {
      LocalNotifications.cancel({
        notifications: data.notifications.filter(
          (notification) => notification.extra?.habitID === habitID
        )
      });
    }
  },

  cancelAllLocalNotifications: async () => {
    const data = await LocalNotifications.getPending();
    console.log('Pending');
    console.log(data);
    if (data.notifications) {
      LocalNotifications.cancel(data);
    }
  },

  requestNotifications: async () => {
    try {
      let permissions = await NotificationHelper.getNotificationPermissions();
      if (permissions === 'prompt') {
        await NotificationHelper.registerNotifications();
        permissions = await NotificationHelper.getNotificationPermissions();
        if (permissions === 'granted') {
          await NotificationHelper.addListeners();
          await NotificationHelper.registerNotifications();
          return true;
        }
        return false;
      } else if (permissions === 'denied') {
        await NotificationHelper.registerNotifications();
        return false;
      } else {
        return true;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }
};

export default NotificationHelper;
