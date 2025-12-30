const express = require('express');
const router = express.Router();
const Deed = require('../models/Deed');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Add Deed
router.post('/add', auth, async (req, res) => {
    try {
        const { description, coinValue } = req.body;

        // Create new deed
        const deed = new Deed({
            user: req.user._id,
            description,
            coinValue: parseInt(coinValue)
        });

        await deed.save();

        // Update User Stats
        const user = await User.findById(req.user._id);
        user.deeds.push(deed._id);
        user.coins += parseInt(coinValue);

        // Nice Meter Logic
        let niceIncrease = 0;
        if (coinValue == 10) niceIncrease = 5;
        else if (coinValue == 25) niceIncrease = 10;
        else if (coinValue >= 50) niceIncrease = 15;

        user.niceMeter = Math.min(100, user.niceMeter + niceIncrease);

        // Check Unlockables
        if (user.coins >= 100 && !user.stickersUnlocked.includes('sticker1')) {
            user.stickersUnlocked.push('sticker1');
        }
        if (user.coins >= 300 && !user.stickersUnlocked.includes('sticker2')) {
            user.stickersUnlocked.push('sticker2');
        }
        if (user.coins >= 500 && !user.stickersUnlocked.includes('badge')) {
            user.stickersUnlocked.push('badge');
        }

        await user.save();

        res.json({
            message: 'Deed added!',
            coins: user.coins,
            niceMeter: user.niceMeter,
            stickersUnlocked: user.stickersUnlocked
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get Recent Deeds (Community Feed)
router.get('/recent', async (req, res) => {
    try {
        const deeds = await Deed.find().sort({ date: -1 }).limit(20).populate('user', 'name avatar');
        res.json(deeds);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Global Stats
router.get('/stats', async (req, res) => {
    try {
        const totalDeeds = await Deed.countDocuments();

        const aggregation = await Deed.aggregate([
            {
                $group: {
                    _id: null,
                    totalCoins: { $sum: "$coinValue" }
                }
            }
        ]);

        const totalCoins = aggregation.length > 0 ? aggregation[0].totalCoins : 0;
        const goal = 10000; // Community Goal

        res.json({
            totalDeeds,
            totalCoins,
            goal
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
