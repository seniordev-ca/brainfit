import jwt from 'jsonwebtoken';
import superagent from 'superagent';
import {
  initializeFirebase,
  verifyIdToken
} from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';
import * as admin from 'firebase-admin';

export async function SendNotificationToGroup(message, notificationGroup) {
  const notification = {
    notification: {
      title: 'Mind Notification',
      body: message
    },
    topic: notificationGroup
  };
  const defaultMessaging = admin.messaging();
  await defaultMessaging.send(notification);
}

export const handler = async (event, context, callback) => {
  try {
    initializeFirebase(admin);
    const jwtToken = event.headers.Authorization.replace('Bearer ', '');
    await verifyIdToken(jwtToken, jwt, superagent);

    const { message, notificationGroup } = JSON.parse(event.body);

    await SendNotificationToGroup(message, notificationGroup);

    callback(null, lambdaResponse(204, {}));
  } catch (error) {
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
