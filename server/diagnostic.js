const { db } = require('./config/firebase');

async function testConnection() {
    console.log("Testing Firestore Connection...");
    try {
        const testDoc = await db.collection('test_connection').add({
            timestamp: new Date().toISOString(),
            message: "Hello from diagnostics"
        });
        console.log("SUCCESS: Wrote document with ID:", testDoc.id);

        const snapshot = await db.collection('test_connection').get();
        console.log("SUCCESS: Read collection, count:", snapshot.size);

    } catch (error) {
        console.error("FAILURE: Firestore Error:");
        console.error(error);
    }
}

testConnection();
