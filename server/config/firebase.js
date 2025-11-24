const admin = require('firebase-admin');
const path = require('path');

// CHECK: Does serviceAccountKey.json exist?
// If not, we use a placeholder or environment variables.
// For this setup, we'll assume the user will provide the file or we use mock for dev if missing (but better to fail fast or warn).

try {
    let serviceAccount;

    console.log("Checking FIREBASE_SERVICE_ACCOUNT env var...");
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        console.log("FIREBASE_SERVICE_ACCOUNT found. Parsing...");
        // Use environment variable if available (Production/Render)
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        console.log("FIREBASE_SERVICE_ACCOUNT NOT found. Falling back to file.");
        // Fallback to local file (Development)
        serviceAccount = require('./serviceAccountKey.json');
    }
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized Successfully");
} catch (error) {
    console.warn("WARNING: Firebase Service Account Key not found or invalid.");
    console.warn("Please place 'serviceAccountKey.json' in the 'server/config' directory.");
    console.warn("Error:", error.message);
    // Fallback for build/test without creds if needed, or just let it fail later.
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
