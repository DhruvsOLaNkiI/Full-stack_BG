const { db } = require('./config/firebase');

const email = process.argv[2];

if (!email) {
    console.log('Usage: node makeAdmin.js <email>');
    process.exit(1);
}

async function makeAdmin() {
    try {
        const snapshot = await db.collection('users').where('email', '==', email).get();

        if (snapshot.empty) {
            console.log('User not found');
            return;
        }

        const userDoc = snapshot.docs[0];
        await userDoc.ref.update({ role: 'admin' });

        console.log(`SUCCESS: User ${email} is now an ADMIN.`);
        console.log('Please logout and login again for changes to take effect.');
    } catch (error) {
        console.error('Error:', error);
    }
}

makeAdmin();
