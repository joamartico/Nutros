import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCIHoKseYt0TNOcfhS8S7SbtRG2zdaFXu0",
  authDomain: "nutros-ssg.firebaseapp.com",
  projectId: "nutros-ssg",
  storageBucket: "nutros-ssg.appspot.com",
  messagingSenderId: "66208231636",
  appId: "1:66208231636:web:b564683143ef1659048b41",
  measurementId: "G-PT39LJLNLS"
};

const firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig, 'nutros');

export default firebaseApp

// const db = firebase.firestore()


// export const analytics = getAnalytics(app);
// export const messaging = getMessaging(app);

// const key = 'BNQBOCiyuxLJAh6k5GcyqWcJjrJ99wFoqN2oMgZkPLSaFOdZWBVzS3MaIfKCM10vI3mOpEMSMavzNId2YD9JJK4'

// getToken(messaging, {vapidKey: key}).then(currentToken => {
//   if (currentToken) {
//     console.log('current token for client: ', currentToken);
//     // Track the token -> client mapping, by sending to backend server
//     // show on the UI that permission is secured
//   } else {
//     // Show permission request.
//     console.log('No registration token available. Request permission to generate one.');
//     // ...
//   }
// })


