import { RegisterForNotificationGroup } from '../lambda/handlers/registerForNotificationGroup';

const mockSubscribe = jest.fn();

jest.mock('firebase-admin', () => {
  return {
    // ...jest.requireActual('firebase-admin'),
    initializeApp: jest.fn(),
    messaging: () => {
      return {
        subscribeToTopic: mockSubscribe
      };
    }
  };
});
test('RegisterForNotificationGroup function is called successfully', async () => {
  await RegisterForNotificationGroup('firebase-fcm-token', 'general');
  expect(mockSubscribe).toBeCalledWith(['firebase-fcm-token'], 'general');
});
