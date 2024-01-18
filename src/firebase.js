import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBOBpL8Nnj_l0T1JJp4Mm1aFatU-xMACgw",
  authDomain: "listshare-e498a.firebaseapp.com",
  projectId: "listshare-e498a",
  storageBucket: "listshare-e498a.appspot.com",
  messagingSenderId: "784592790198",
  appId: "1:784592790198:web:e0497ac5ed7703690cfc17",
  measurementId: "G-3K6Z2KGBEV",
  databaseURL: "https://listshare-e498a-default-rtdb.europe-west1.firebasedatabase.app"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getDatabase(app);

logEvent(analytics, 'started_app');
