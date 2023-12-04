import { SendNotificationToGroup } from '../lambda/handlers/sendNotificationToGroup';

const mockSend = jest.fn();

jest.mock('firebase-admin', () => {
  return {
    // ...jest.requireActual('firebase-admin'),
    initializeApp: jest.fn(),
    messaging: () => {
      return {
        send: mockSend
      };
    }
  };
});
test('SendNotificationToGroup function is called successfully', async () => {
  await SendNotificationToGroup('Hello world!', 'general');
  expect(mockSend).toBeCalledWith({
    notification: {
      title: 'Mind Notification',
      body: 'Hello world!'
    },
    topic: 'general'
  });
});
