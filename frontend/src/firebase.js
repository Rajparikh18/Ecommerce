import firebase  from "firebase/compat/app";
import 'firebase/compat/auth';

const firebaseConfig={

    apiKey: import.meta.vite.REACT_APP_FIREBASE_API_KEY,
    authDomain: import.meta.vite.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.vite.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.vite.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.vite.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.vite.REACT_APP_FIREBASE_APP_ID,
    measurementId: import.meta.vite.REACT_APP_FIREBASE_MEASUREMENT_ID
}

firebase.initializeApp(firebaseConfig);

export default firebase
