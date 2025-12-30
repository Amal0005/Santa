const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Add Letter
router.post('/', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const user = await User.findById(req.user._id);

        if (user.coins < 50) {
            return res.status(400).json({ message: 'Not enough coins! Need 50 coins.' });
        }

        user.letters.push({ content });
        user.coins -= 50;

        // Unlock badge if first letter
        if (!user.stickersUnlocked.includes('letter-badge')) {
            user.stickersUnlocked.push('letter-badge');
        }

        await user.save();

        // Simulate AI Response (Simple template for now)
        // Static Santa Response
        const santaResponse = "Ho Ho Ho! I received your lovely letter. You are doing great! 🎅✨";

        res.json({
            message: 'Letter sent to North Pole!',
            santaResponse,
            coins: user.coins,
            stickersUnlocked: user.stickersUnlocked
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
