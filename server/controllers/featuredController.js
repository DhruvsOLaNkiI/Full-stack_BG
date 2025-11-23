const { db, admin } = require('../config/firebase');
const Post = require('../models/Post');

const FEATURED_DOC_ID = 'home_featured';

exports.getFeatured = async (req, res) => {
    try {
        // 1. Get the config
        const doc = await db.collection('settings').doc(FEATURED_DOC_ID).get();

        if (!doc.exists) {
            return res.json({
                hero: null,
                topRight: null,
                middleList: [],
                bottomRight: null
            });
        }

        const config = doc.data();

        // 2. Collect all unique IDs to fetch in one batch
        const idsToFetch = new Set();
        if (config.hero) idsToFetch.add(config.hero);
        if (config.topRight) idsToFetch.add(config.topRight);
        if (config.bottomRight) idsToFetch.add(config.bottomRight);
        if (Array.isArray(config.middleList)) {
            config.middleList.forEach(id => {
                if (id) idsToFetch.add(id);
            });
        }

        const uniqueIds = Array.from(idsToFetch);

        if (uniqueIds.length === 0) {
            return res.json({
                hero: null,
                topRight: null,
                middleList: [],
                bottomRight: null
            });
        }

        // 3. Fetch all posts in a single query
        // Firestore 'in' query is limited to 10 (or 30 in some versions), usually safe for featured section
        // If > 10, we might need to chunk, but for now assuming < 10 featured items
        const postsSnapshot = await db.collection('posts')
            .where(admin.firestore.FieldPath.documentId(), 'in', uniqueIds)
            .get();

        const postsMap = new Map();
        postsSnapshot.forEach(doc => {
            postsMap.set(doc.id, { id: doc.id, ...doc.data() });
        });

        // 4. Reconstruct the response structure
        const hero = config.hero ? postsMap.get(config.hero) || null : null;
        const topRight = config.topRight ? postsMap.get(config.topRight) || null : null;
        const bottomRight = config.bottomRight ? postsMap.get(config.bottomRight) || null : null;
        const middleList = (config.middleList || [])
            .map(id => postsMap.get(id))
            .filter(post => post !== undefined); // Filter out missing/deleted posts

        // 5. Add Cache-Control header (5 minutes)
        res.set('Cache-Control', 'public, max-age=300');

        res.json({
            hero,
            topRight,
            bottomRight,
            middleList
        });

    } catch (error) {
        console.error('Error fetching featured posts:', error);
        res.status(500).json({ message: 'Error fetching featured posts' });
    }
};

exports.updateFeatured = async (req, res) => {
    try {
        // Expecting body: { hero: 'id', topRight: 'id', middleList: ['id', 'id'], bottomRight: 'id' }
        const { hero, topRight, middleList, bottomRight } = req.body;

        // Validate role (middleware should handle this, but double check)
        if (req.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const data = {
            hero: hero || null,
            topRight: topRight || null,
            middleList: Array.isArray(middleList) ? middleList : [],
            bottomRight: bottomRight || null,
            updatedAt: new Date().toISOString()
        };

        await db.collection('settings').doc(FEATURED_DOC_ID).set(data, { merge: true });

        res.json({ message: 'Featured posts updated', data });

    } catch (error) {
        console.error('Error updating featured posts:', error);
        res.status(500).json({ message: 'Error updating featured posts' });
    }
};
