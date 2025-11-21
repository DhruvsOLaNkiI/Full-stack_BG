// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_PqLU3UtR8WrPI4qC-bq0MyscXaW9XG8",
    authDomain: "blogg-b2c86.firebaseapp.com",
    projectId: "blogg-b2c86",
    storageBucket: "blogg-b2c86.firebasestorage.app",
    messagingSenderId: "926455932126",
    appId: "1:926455932126:web:5e03095c1816dccf0a8e4f",
    measurementId: "G-K0HGZZNQT5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
