const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Deed = require('../models/Deed');
const auth = require('../middleware/auth');

// Get Dashboard Data
router.get('/dashboard', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        // Get last 5 deeds
        const deeds = await Deed.find({ user: req.user._id }).sort({ date: -1 }).limit(5);
        res.json({ user, deeds });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find()
            .sort({ coins: -1 })
            .limit(10)
            .select('name coins stickersUnlocked');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
