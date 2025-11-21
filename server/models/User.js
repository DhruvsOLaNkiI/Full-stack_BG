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
