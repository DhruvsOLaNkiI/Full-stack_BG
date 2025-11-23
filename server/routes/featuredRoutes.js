const express = require('express');
const router = express.Router();
const featuredController = require('../controllers/featuredController');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Public: Get featured posts
router.get('/', featuredController.getFeatured);

// Admin: Update featured posts
router.put('/', verifyToken, isAdmin, featuredController.updateFeatured);

module.exports = router;
