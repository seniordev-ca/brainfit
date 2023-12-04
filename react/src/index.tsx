import 'react-spring-bottom-sheet/dist/style.css';

import './index.scss';
import './react-widgets.scss';

import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';

import reportWebVitals from './reportWebVitals';
import store from './store/store';

import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  initializeAuth,
  signInAnonymously
} from 'firebase/auth';
import { SyncHelper } from 'helpers/syncHelper';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_ANALYTICS_KEY,
  authDomain: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: `${process.env.REACT_APP_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

getAnalytics(app);

const auth = initializeAuth(app, {
  persistence: browserLocalPersistence
});

// Simplified authentication handling
auth.onAuthStateChanged(async (user) => {
  console.log('AUTH STATE CHANGED', user);
  if (!user) {
    user = (await signInAnonymously(auth)).user;
  } else {
    await SyncHelper.refreshState();
  }
});

const container: any = document.getElementById('root');
const root: any = createRoot(container!);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
