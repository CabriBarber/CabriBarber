// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBlJvTey3YXLMr0lVyUGzlcYhiFGzAFWN0",
  authDomain: "cabriweb.firebaseapp.com",
  projectId: "cabriweb",
  storageBucket: "cabriweb.appspot.com",
  messagingSenderId: "108389391061",
  appId: "1:108389391061:web:bb4e0c5cae4e8aa2596e02"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();