import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// Firestoreはログインやユーザー登録の実装には使わないが、今後のことを考えて入れておく
import { getFirestore, Firestore } from 'firebase/firestore'
import {
  getAuth,
  Auth,
} from "firebase/auth";

// .envファイルで設定した環境変数をfirebaseConfigに入れる
export const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

let firebaseApp = initializeApp(firebaseConfig);
let auth = getAuth();
let firestore = getFirestore();

// サーバーサイドでレンダリングするときにエラーが起きないようにするための記述
if (typeof window !== "undefined" && !getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth();
  firestore = getFirestore();
}
export { firebaseApp, auth, firestore };
