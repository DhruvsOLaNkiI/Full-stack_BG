const { db } = require('../config/firebase');

class User {
    constructor(id, email, password, role = 'blogger', name) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
        this.createdAt = new Date().toISOString();
    }

    static async findByEmail(email) {
        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    }

    static async findByName(name) {
        // Try case-insensitive search first
        let snapshot = await db.collection('users').where('name_lower', '==', name.toLowerCase()).get();

        // Fallback to exact match on 'name' if 'name_lower' doesn't exist yet (for old records)
        if (snapshot.empty) {
            snapshot = await db.collection('users').where('name', '==', name).get();
        }

        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
    }

    static async create(userData) {
        const docRef = await db.collection('users').add(userData);
        return { id: docRef.id, ...userData };
    }

    static async findById(id) {
        const doc = await db.collection('users').doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    }
}

module.exports = User;
