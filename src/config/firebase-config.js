import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; 

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "cloud-file-manager-400410.firebaseapp.com",
    projectId: "cloud-file-manager-400410",
    storageBucket: "cloud-file-manager-400410.appspot.com",
    messagingSenderId: "1082178109230",
    appId: "1:1082178109230:web:177e3c6ccfcca7a65cc4bf",
    measurementId: "G-X6JSEWSS9C"
};

export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);