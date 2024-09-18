const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();

const Item = require('./models/Item');
const User = require('./models/User');

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

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

// Ajouter un nouvel item (POST)
app.post('/items', async (req, res) => {
    const item = new Item({
        name: req.body.name,
        description: req.body.description
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Récupérer un item par son ID (GET)
app.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Register route
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token, username: user.username }); // Renvoie également le nom d'utilisateur
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user icon
app.put('/user/icon', async (req, res) => {
    try {
        const { userId, icon } = req.body;
        const user = await User.findByIdAndUpdate(userId, { icon }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Icon updated successfully', icon: user.icon });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

///////////////////////////////////////
// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
