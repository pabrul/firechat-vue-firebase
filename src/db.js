import firebase from "firebase/app";
import "firebase/database";

const config = {
  apiKey: "AIzaSyCHJoPNU4gogebmhrLg3nSBO6QpiAl3KF0",
  authDomain: "firevuechat-5ee0c.firebaseapp.com",
  projectId: "firevuechat-5ee0c",
  storageBucket: "firevuechat-5ee0c.appspot.com",
  messagingSenderId: "588357774308",
  appId: "1:588357774308:web:a5e0150127b39dd0d2b5f1"
}

const db = firebase.initializeApp(config);
export default db;