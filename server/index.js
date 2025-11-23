const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
console.log('Loading auth routes...');
app.use('/api/auth', require('./routes/authRoutes'));
console.log('Loading post routes...');
app.use('/api/posts', require('./routes/postRoutes'));
console.log('Loading user routes...');
app.use('/api/users', require('./routes/userRoutes'));
console.log('Loading featured routes...');
app.use('/api/featured', require('./routes/featuredRoutes'));
console.log('All routes loaded successfully');

// Admin Route (Example)
app.get('/api/admin/stats', require('./middleware/auth').verifyAdmin, (req, res) => {
    res.json({ message: 'Admin stats here' });
});

app.get('/', (req, res) => {
    res.send('Blog API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
