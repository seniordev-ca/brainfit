import { initializeFirebase } from '/opt/nodejs/firebaseTokenHelper';
import { lambdaResponse } from '/opt/nodejs/response';
import * as admin from 'firebase-admin';

const locale = 'en-CA';

export async function ContentfulEntryPublish(title, body) {
  const notification = {
    notification: {
      title,
      body
    },
    topic: 'general'
  };
  const defaultMessaging = admin.messaging();
  await defaultMessaging.send(notification);
}

export const handler = async (event, context, callback) => {
  try {
    initializeFirebase(admin);
    const contentfulSecret = event.headers.CONTENTFUL_SECRET;
    console.log(event);

    if (contentfulSecret === process.env.CONTENTFUL_SECRET) {
      console.log(event.body);

      const { fields, sys } = JSON.parse(event.body);

      if (sys.contentType?.sys?.id === 'broadcast') {
        const { title, body } = fields;

        await ContentfulEntryPublish(title[locale], body[locale]);
      }
      callback(null, lambdaResponse(204, {}));
    } else {
      callback(null, lambdaResponse(401, {}));
    }
  } catch (error) {
    console.log(error);
    callback(null, lambdaResponse(500, { error }));
  }
};
