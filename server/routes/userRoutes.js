const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

router.get('/:id', userController.getProfile);
router.put('/:id', verifyToken, userController.updateProfile);

module.exports = router;
