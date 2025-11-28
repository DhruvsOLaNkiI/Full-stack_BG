const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

// Public
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

// Protected
router.post('/', verifyToken, postController.createPost);
router.put('/:id', verifyToken, postController.updatePost);
router.delete('/:id', verifyToken, postController.deletePost);
router.post('/:id/like', verifyToken, postController.toggleLike);
router.post('/:id/comments', verifyToken, postController.addComment);
router.get('/:id/comments', postController.getComments);

// API Key Protected
// const { verifyApiKey } = require('../middleware/apiKeyAuth'); // Moved to top
// router.post('/auto-create', verifyApiKey, postController.autoCreatePost); // Moved to top

module.exports = router;
