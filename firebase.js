var firebaseConfig = {
  apiKey: "AIzaSyBlJvTey3YXLMr0lVyUGzlcYhiFGzAFWN0",
  authDomain: "cabriweb.firebaseapp.com",
  projectId: "cabriweb",
  storageBucket: "cabriweb.appspot.com",
  messagingSenderId: "1083893391061",
  appId: "1:1083893391061:web:14c6fd57798d3705f90c5c"
};
firebase.initializeApp(firebaseConfig);

// ✅ Línea nueva que arregla Firestore en GitHub Pages:
firebase.firestore().settings({ ignoreUndefinedProperties: true });

var db = firebase.firestore();
