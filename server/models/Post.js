const { db, admin } = require('../config/firebase');

class Post {
    constructor(title, content, authorId, authorName, tags = [], category = 'General', imageUrl = '') {
        this.title = title;
        this.content = content;
        this.authorId = authorId;
        this.authorName = authorName;
        this.tags = tags;
        this.category = category;
        this.imageUrl = imageUrl || '';
        this.likes = likes || [];
        this.commentsCount = commentsCount || 0;
        this.views = 0;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    static async create(postData) {
        const docRef = await db.collection('posts').add(postData);
        return { id: docRef.id, ...postData };
    }

    static async incrementViews(id) {
        await db.collection('posts').doc(id).update({
            views: admin.firestore.FieldValue.increment(1)
        });
    }

    static async findAll(filters = {}) {
        let query = db.collection('posts');

        if (filters.category) {
            query = query.where('category', '==', filters.category);
        }
        if (filters.tag) {
            query = query.where('tags', 'array-contains', filters.tag);
        }
        if (filters.startDate) {
            query = query.where('createdAt', '>=', filters.startDate);
        }
        if (filters.endDate) {
            query = query.where('createdAt', '<=', filters.endDate);
        }

        // Default sort by date if no other specific sort that conflicts
        // Note: Firestore requires an index for range filter + sort on different field
        // For now, we'll fetch and let controller sort if needed, or just default sort here
        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    static async findById(id) {
        const doc = await db.collection('posts').doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() };
    }

    static async update(id, data) {
        await db.collection('posts').doc(id).update({
            ...data,
            updatedAt: new Date().toISOString()
        });
        return { id, ...data };
    }

    static async delete(id) {
        await db.collection('posts').doc(id).delete();
        return true;
    }
}

module.exports = Post;
