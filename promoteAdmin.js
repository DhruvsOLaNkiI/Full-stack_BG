const { db } = require('./server/config/firebase');

const email = 'kirdar@gmail.com'; // Replace with user's email if different, or pass as arg

async function promoteUser() {
    try {
        console.log(`Promoting user with email: ${email}...`);
        const snapshot = await db.collection('users').where('email', '==', email).get();

        if (snapshot.empty) {
            console.log('User not found!');
            return;
        }

        const userDoc = snapshot.docs[0];
        await db.collection('users').doc(userDoc.id).update({ role: 'admin' });
        
        console.log('✅ User promoted to ADMIN successfully!');
        console.log('👉 PLEASE LOGOUT AND LOGIN AGAIN to update your token.');
    } catch (error) {
        console.error('Error promoting user:', error);
    }
}

promoteUser();
