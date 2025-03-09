var admin = require('firebase-admin');
require('dotenv').config();
// Initialize Firebase (replace with your actual config)
const serviceAccount =  JSON.parse(process.env.FIREBASE_CRED); // Replace with your Firebase service account key file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spokeit-9f532-default-rtdb.firebaseio.com",
  // storageBucket: "spokeit-9f532.appspot.com"
});

module.exports = admin; // Export the admin instance