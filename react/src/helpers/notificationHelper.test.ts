// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PushNotifications } from '@capacitor/push-notifications';
import NotificationHelper from './notificationHelper';

const mockAddListener = jest.fn();
const mockCheckPermissions = jest.fn();
const mockRequestPermissions = jest.fn();
const mockRegister = jest.fn();
const mockDelivered = jest.fn();

jest.mock('@capacitor-community/fcm', () => { });

jest.mock('@capacitor/push-notifications', () => ({
  PushNotifications: {
    addListener: () => mockAddListener(),
    checkPermissions: () => mockCheckPermissions(),
    requestPermissions: () => mockRequestPermissions(),
    register: () => mockRegister(),
    getDeliveredNotifications: () => mockDelivered()
  }
}));

const mockSchedule = jest.fn();
const mockGetPending = jest.fn();
const mockCancel = jest.fn();

jest.mock('@capacitor/local-notifications', () => ({
  LocalNotifications: {
    addListener: () => mockAddListener(),
    schedule: (data: any) => mockSchedule(data),
    getPending: () => mockGetPending(),
    cancel: (data: any) => mockCancel(data)
  }
}));

describe('Notification Helper Unit Tests', () => {
  describe('PushNotification tests', () => {
    test('addListener test', async () => {
      await NotificationHelper.addListeners()
      expect(mockAddListener).toBeCalledTimes(5)
    })

    test('registerForNotifications allow test', async () => {
      mockCheckPermissions.mockResolvedValueOnce({
        receive: 'prompt'
      });
      mockRequestPermissions.mockResolvedValueOnce({
        receive: 'granted'
      });
      await NotificationHelper.registerNotifications();
      expect(mockRegister).toBeCalled();
    });

    test('registerForNotifications denied test', async () => {
      mockCheckPermissions.mockResolvedValueOnce({
        receive: 'prompt'
      });
      mockRequestPermissions.mockResolvedValueOnce({
        receive: 'denied'
      });
      try {
        await NotificationHelper.registerNotifications();
      } catch (error) {
        console.log('Caught denied error');
      }
      expect(mockRegister).toBeCalledTimes(0);
    });

    test('getDeliveredNotifications test', async () => {
      await NotificationHelper.getDeliveredNotifications();
      expect(mockDelivered).toBeCalledTimes(1);
    });
  });

  describe('LocalNotification tests', () => {
    // const habitID = 'test-habit';
    // const title = 'Test Habit';

    beforeAll(() => {
      // Dynamo mocks use timestamps for record creation
      // Set system time to try and sync timestamp creation
      jest.useFakeTimers('modern');
      jest.setSystemTime(new Date(2020, 3, 1));
    });

    afterAll(() => {
      jest.useRealTimers();
      jest.resetAllMocks();
    });
    // test('scheduleHabitNotificationWithSchedule multiple days', async () => {
    //   const scheduleString = 'SuMoTu 10:00'
    //   NotificationHelper.scheduleHabitNotificationWithSchedule(habitID, title, scheduleString)
    //   expect(mockSchedule).toBeCalledTimes(3)
    // })

    // test('scheduleHabitNotificationWithSchedule format', async () => {
    //   const scheduleString = 'Su 10:00'
    //   const structure = {
    //     notifications: [
    //       {
    //         title: 'BrainFit',
    //         body: title,
    //         id: new Date().getTime() + 1,
    //         schedule: {
    //           on: {
    //             weekday: 1,
    //             hour: 10,
    //             minute: 0
    //           }
    //         },
    //         extra: {
    //           habitID
    //         }
    //       }
    //     ]
    //   }
    //   NotificationHelper.scheduleHabitNotificationWithSchedule(habitID, title, scheduleString)
    //   expect(mockSchedule).toHaveBeenCalledWith(structure)
    // })

    // test('scheduleHabitNotificationWithSchedule leading zero hour format', async () => {
    //   const scheduleString = 'Th 08:15'
    //   const structure = {
    //     notifications: [
    //       {
    //         title: 'BrainFit',
    //         body: title,
    //         id: new Date().getTime() + 5,
    //         schedule: {
    //           on: {
    //             weekday: 5,
    //             hour: 8,
    //             minute: 15
    //           }
    //         },
    //         extra: {
    //           habitID
    //         }
    //       }
    //     ]
    //   }
    //   NotificationHelper.scheduleHabitNotificationWithSchedule(habitID, title, scheduleString)
    //   expect(mockSchedule).toHaveBeenCalledWith(structure)
    // })

    const pendingHabitsData = {
      notifications: [
        {
          title: 'habit 1',
          extra: {
            habitID: 'habit1'
          }
        },
        {
          title: 'habit 2',
          extra: {
            habitID: 'habit2'
          }
        },
        {
          title: 'habit 3',
          extra: {
            habitID: 'habit3'
          }
        }
      ]
    };

    test('cancelLocalNotificationForHabit', async () => {
      mockGetPending.mockResolvedValueOnce(pendingHabitsData);
      await NotificationHelper.cancelLocalNotificationForHabit('habit2');
      expect(mockCancel).toHaveBeenCalledWith({
        notifications: [pendingHabitsData.notifications[1]]
      });
    });

    test('cancelAllLocalNotifications', async () => {
      mockGetPending.mockResolvedValueOnce(pendingHabitsData);
      await NotificationHelper.cancelAllLocalNotifications();
      expect(mockCancel).toHaveBeenCalledWith(pendingHabitsData);
    });
  });
});
