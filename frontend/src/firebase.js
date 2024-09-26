import firebase  from "firebase/compat/app";
import 'firebase/compat/auth';

const firebaseConfig={

    apiKey: "AIzaSyC_J5olcCerrPxyntWFcRDDt6zzSMlUU1Y",
    authDomain: "ecommerce-website-19ecb.firebaseapp.com",
    projectId: "ecommerce-website-19ecb",
    storageBucket: "ecommerce-website-19ecb.appspot.com",
    messagingSenderId: "179282251767",
    appId: "1:179282251767:web:6a4cf6ea01eac5d24d28f2",
    measurementId: "G-85R3DHK87Q"
}

firebase.initializeApp(firebaseConfig);

export default firebase
