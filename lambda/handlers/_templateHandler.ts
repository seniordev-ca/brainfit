// import {DatabaseHelper} from '/opt/nodejs/databaseHelper';
// import FirebaseHelper from '/opt/nodejs/firebaseTokenHelper';
// import admin from 'firebase-admin';
// import response from '/opt/nodejs/response';

export const handler = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: 'this is a template handler',
      input: event
    })
  };

  callback(null, response);
};
