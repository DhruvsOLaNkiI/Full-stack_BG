const Post = require('../models/Post');
const slugify = require('slugify');

// Helper to resolve post by ID or Slug
const resolvePost = async (idOrSlug) => {
    let post = await Post.findBySlug(idOrSlug);
    if (!post) {
        post = await Post.findById(idOrSlug);
    }
    return post;
};

exports.getAllPosts = async (req, res) => {
    try {
        const { category, tag, sortBy, startDate, endDate, limit = 50 } = req.query;
        let posts = await Post.findAll({ category, tag, startDate, endDate });

        // In-memory sorting
        if (sortBy === 'likes') {
            posts.sort((a, b) => {
                const likesA = a.likes?.length || 0;
                const likesB = b.likes?.length || 0;
                if (likesB !== likesA) {
                    return likesB - likesA;
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
        } else {
            // Default to date desc
            posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Limit results for performance
        const limitedPosts = posts.slice(0, parseInt(limit));

        // Add cache headers (5 minutes)
        res.set('Cache-Control', 'public, max-age=300');
        res.json(limitedPosts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        let post = await Post.findBySlug(id);

        if (!post) {
            post = await Post.findById(id);
        }

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // View Counting Logic
        const token = req.headers['authorization'];
        if (token) {
            try {
                const bearer = token.split(' ')[1];
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(bearer, process.env.JWT_SECRET || 'default_secret_key');
                const userId = decoded.id;
                const postId = req.params.id;

                const { db } = require('../config/firebase');
                const viewsRef = db.collection('post_views');

                // Check for existing view in last hour
                // Check for existing view in last hour
                // Simplified query to avoid complex index requirement
                const snapshot = await viewsRef
                    .where('userId', '==', userId)
                    .where('postId', '==', postId)
                    .get();

                const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                const hasRecentView = snapshot.docs.some(doc => {
                    const data = doc.data();
                    return new Date(data.timestamp) > oneHourAgo;
                });

                if (!hasRecentView) {
                    // No recent view, so count it
                    await viewsRef.add({
                        userId,
                        postId,
                        timestamp: new Date().toISOString()
                    });
                    await Post.incrementViews(postId);
                    post.views = (post.views || 0) + 1; // Update local object to return new count
                }
            } catch (err) {
                console.error("View counting error:", err.message);
                // Continue even if view counting fails
            }
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching post', error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content, tags, category } = req.body;
        const User = require('../models/User');

        // Fetch user to get their name
        const user = await User.findById(req.userId);
        const authorName = user?.name || 'Anonymous';

        // Generate Slug
        let slug = slugify(title, { lower: true, strict: true });

        // Ensure uniqueness
        let slugExists = await Post.findBySlug(slug);
        let counter = 1;
        let originalSlug = slug;

        while (slugExists) {
            slug = `${originalSlug}-${counter}`;
            slugExists = await Post.findBySlug(slug);
            counter++;
        }

        const newPost = {
            title,
            content,
            authorId: req.userId,
            authorName,
            tags: tags || [],
            category: category || 'General',
            imageUrl: req.body.imageUrl || '',
            slug,
            likes: [],
            commentsCount: 0,
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const created = await Post.create(newPost);
        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { title, content, tags, category, imageUrl } = req.body;
        const post = await resolvePost(req.params.id);

        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check ownership or admin
        if (post.authorId !== req.userId && req.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        console.log(`Updating post ${req.params.id} with data:`, { title, content, tags, category, imageUrl });

        // Filter out undefined values to avoid overwriting with undefined if not provided
        const updateData = { title, content, tags, category };
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

        const updated = await Post.update(post.id, updateData);
        console.log('Post updated in DB:', updated);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        console.log(`Attempting to delete post: ${req.params.id}`);
        console.log(`User: ${req.userId}, Role: ${req.role}`);

        const post = await resolvePost(req.params.id);

        if (!post) {
            console.log('Post not found');
            return res.status(404).json({ message: 'Post not found' });
        }

        console.log(`Post author: ${post.authorId}`);

        if (post.authorId !== req.userId && req.role !== 'admin') {
            console.log('Not authorized');
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Post.delete(post.id);
        console.log('Post deleted successfully');
        res.json({ message: 'Post deleted' });
    } catch (error) {
        console.error('Error in deletePost:', error);
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
};

exports.bulkDeletePosts = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'No IDs provided' });
        }

        // Admin check
        if (req.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        console.log(`Bulk deleting ${ids.length} posts`);

        // Use Promise.all for parallel deletion
        // We use Post.delete which handles the DB call
        await Promise.all(ids.map(id => Post.delete(id)));

        console.log('Bulk delete successful');
        res.json({ message: `Successfully deleted ${ids.length} posts` });
    } catch (error) {
        console.error('Error in bulkDeletePosts:', error);
        res.status(500).json({ message: 'Error bulk deleting posts', error: error.message });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const { db } = require('../config/firebase');
        const post = await resolvePost(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const postRef = db.collection('posts').doc(post.id);
        const likes = post.likes || [];
        const userId = req.userId;

        if (likes.includes(userId)) {
            // Unlike
            await postRef.update({
                likes: likes.filter(id => id !== userId)
            });
        } else {
            // Like
            await postRef.update({
                likes: [...likes, userId]
            });
        }

        const updated = await postRef.get();
        res.json({ id: post.id, ...updated.data() });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling like', error: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { db } = require('../config/firebase');
        const User = require('../models/User');

        const post = await resolvePost(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Fetch user to get their name
        const user = await User.findById(req.userId);
        const authorName = user?.name || 'Anonymous';

        const comment = {
            content,
            authorId: req.userId,
            authorName,
            createdAt: new Date().toISOString()
        };

        await db.collection('posts').doc(post.id).collection('comments').add(comment);

        // Increment comment count
        const postRef = db.collection('posts').doc(post.id);
        await postRef.update({
            commentsCount: (post.commentsCount || 0) + 1
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { db } = require('../config/firebase');
        const post = await resolvePost(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const snapshot = await db.collection('posts').doc(post.id).collection('comments')
            .orderBy('createdAt', 'desc')
            .get();

        const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};
