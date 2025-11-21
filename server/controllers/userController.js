const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Don't send password
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name } = req.body;

        console.log('Update profile request:', {
            userId: req.userId,
            paramId: req.params.id,
            name,
            match: req.userId === req.params.id
        });

        // Only allow users to update their own profile
        if (req.userId !== req.params.id) {
            console.log('Authorization failed: userId mismatch');
            return res.status(403).json({ message: 'Not authorized' });
        }

        const { db } = require('../config/firebase');

        // Check if user exists first
        const userDoc = await db.collection('users').doc(req.params.id).get();
        if (!userDoc.exists) {
            console.log('User document not found');
            return res.status(404).json({ message: 'User not found' });
        }

        await db.collection('users').doc(req.params.id).update({ name });

        console.log('Profile updated successfully');
        res.json({ message: 'Profile updated successfully', name });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};
