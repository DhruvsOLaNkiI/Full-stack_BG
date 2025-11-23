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

async function checkPosts() {
    console.log("\nChecking Posts Collection...");
    try {
        const snapshot = await db.collection('posts').get();
        console.log(`Found ${snapshot.size} posts.`);
        snapshot.forEach(doc => {
            console.log(`- ${doc.id}: ${JSON.stringify(doc.data().title)}`);
        });
    } catch (error) {
        console.error("Error reading posts:", error);
    }
}

async function migrateUsers() {
    console.log("\nMigrating Users (adding name_lower)...");
    try {
        const snapshot = await db.collection('users').get();
        let count = 0;
        const batch = db.batch();

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.name && !data.name_lower) {
                const ref = db.collection('users').doc(doc.id);
                batch.update(ref, { name_lower: data.name.toLowerCase() });
                count++;
                console.log(`- Scheduled update for: ${data.name}`);
            }
        });

        if (count > 0) {
            await batch.commit();
            console.log(`Successfully updated ${count} users.`);
        } else {
            console.log("No users needed migration.");
        }
    } catch (error) {
        console.error("Error migrating users:", error);
    }
}

migrateUsers();
