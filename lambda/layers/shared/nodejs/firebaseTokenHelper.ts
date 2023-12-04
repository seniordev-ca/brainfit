export const initializeFirebase = (admin) => {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert({
        project_id: process.env.FIREBASE_PROJECT_ID,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        // replace `\` and `n` character pairs w/ single `\n` character
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  }
};

export const verifyIdToken = async (idToken, jwt, superagent) => {
  const response = await superagent
    .get(
      'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
    )
    .query();
  const publicKeys = response.body;
  const header64 = idToken.split('.')[0];
  const header = JSON.parse(Buffer.from(header64, 'base64').toString('ascii'));
  jwt.verify(idToken, publicKeys[header.kid], {
    algorithms: ['RS256'],
    aud: process.env.FIREBASE_PROJECT_ID,
    iss: `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`
  });
  const decoded = jwt.decode(idToken);
  return { uid: decoded.user_id };
};
