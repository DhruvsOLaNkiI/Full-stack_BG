const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            email,
            password: hashedPassword,
            name,
            name_lower: name.toLowerCase(), // Store lowercase name for case-insensitive search
            role: role || 'blogger', // Default to blogger, can be 'admin'
            createdAt: new Date().toISOString()
        };

        const createdUser = await User.create(newUser);

        res.status(201).json({ message: 'User registered successfully', userId: createdUser.id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; // 'email' field from client can now be email or username

        console.log(`Login attempt for: ${email}`);
        let user = await User.findByEmail(email);
        if (!user) {
            console.log(`User not found by email, trying name: ${email}`);
            // Try finding by name if email not found
            user = await User.findByName(email);
        }

        if (!user) {
            console.log('User not found by email or name');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log(`User found: ${user.email} (${user.name})`);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'default_secret_key',
            { expiresIn: '1d' }
        );

        res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
