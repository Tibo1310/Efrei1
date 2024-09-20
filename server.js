const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
require('dotenv').config();

const Item = require('./models/Item');
const User = require('./models/User');

app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));

// Augmenter la limite de taille de charge utile
app.use(express.json({ limit: '20mb' })); // Augmenter la limite à 20MB
app.use(express.urlencoded({ limit: '20mb', extended: true }));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 } // Augmenter la limite de taille de fichier à 20MB
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Failed to authenticate token' });
        req.userId = decoded.userId;
        next();
    });
};

// Vérifier le serveur
app.get('/', (req, res) => {
    res.send('API running');
});

// Récupérer tous les items (GET)
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new post (using the Item model)
app.post('/posts', verifyToken, upload.single('media'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const post = new Item({
            name: title,
            description: description,
            author: req.userId,
            mediaUrl: req.file ? `/uploads/${req.file.filename}` : null,
            type: 'post',
            comments: [], // Initialize comments as an empty array
            likes: [] // Initialize likes as an empty array
        });
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(400).json({ message: error.message });
    }
});

// Get all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Item.find({ type: 'post' }).populate('author', 'username icon followers').sort('-dateCreated');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

///////////////////////////////////////
// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// User registration
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, nationality, knownLanguages, learningLanguages } = req.body;
        
        console.log('Received registration data:', { username, email, nationality, knownLanguages, learningLanguages });
        
        const user = new User({ 
            username, 
            email, 
            password, 
            nationality, 
            knownLanguages, 
            learningLanguages 
        });
        await user.save();

        // Generate token for the new user
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            username: user.username,
            userId: user._id,
            icon: user.icon
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: error.message });
    }
});

// User login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token, username: user.username, userId: user._id, icon: user.icon });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user icon
app.put('/user/icon', verifyToken, upload.single('icon'), async (req, res) => {
    try {
        const userId = req.userId; // This comes from the verifyToken middleware
        let iconUrl = req.body.icon;

        if (req.file) {
            iconUrl = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { icon: iconUrl },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Icon updated successfully', icon: updatedUser.icon });
    } catch (error) {
        console.error('Error updating user icon:', error);
        res.status(500).json({ message: 'Error updating icon' });
    }
});

// Endpoint to fetch user profile
app.get('/user/:userId', verifyToken, async (req, res) => {
    try {
        console.log('Fetching user profile for userId:', req.params.userId);
        const user = await User.findById(req.params.userId).select('-password');
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User profile found:', user);
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Error fetching user data' });
    }
});
