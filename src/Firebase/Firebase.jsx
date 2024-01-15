import firebase from 'firebase/compat/app'
// import 'firebase/compat/firestore'
import 'firebase/compat/auth'

var firebaseConfig = {
  apiKey: "AIzaSyDn6qpEre_hL25jAp2IZLtGD9O-EcC5ykw",
  authDomain: "myapp-5711a.firebaseapp.com",
  projectId: "myapp-5711a",
  storageBucket: "myapp-5711a.appspot.com",
  messagingSenderId: "593680236709",
  appId: "1:593680236709:web:e10c3f9d6dce2c448b8d4c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase