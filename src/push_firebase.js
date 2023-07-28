import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/messaging";
import firebaseConf from "./Env/firebaseCreds.json";
//FOR PUSH NOTIFICATIONS

//!DEV
const firebaseConfig = firebaseConf;

firebase.initializeApp(firebaseConfig);
export let messaging;
if (firebase.messaging.isSupported()) {
  // messaging is supported
  messaging = firebase.messaging();
}
export const db = firebase.firestore();
export default firebase;
