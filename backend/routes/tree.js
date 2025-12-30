const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

const DECORATIONS = {
    'ball-red': { price: 50, name: 'Red Ornament' },
    'ball-blue': { price: 50, name: 'Blue Ornament' },
    'lights': { price: 150, name: 'Fairy Lights' },
    'tinsel': { price: 100, name: 'Gold Tinsel' },
    'star': { price: 500, name: 'Golden Star' },
    'gift': { price: 200, name: 'Gift Box' },
    'candy': { price: 75, name: 'Candy Cane' },
    'snow': { price: 300, name: 'Snow' }
};

// Get User Decoration Data
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('coins decorations');
        res.json({ coins: user.coins, decorations: user.decorations || [] });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Buy Decoration
router.post('/buy', auth, async (req, res) => {
    try {
        const { itemId } = req.body;
        const item = DECORATIONS[itemId];

        if (!item) return res.status(400).json({ message: 'Invalid item' });

        const user = await User.findById(req.user._id);

        if (user.decorations.includes(itemId)) {
            return res.status(400).json({ message: 'You already have this!' });
        }

        if (user.coins < item.price) {
            return res.status(400).json({ message: `Need ${item.price} coins!` });
        }

        user.coins -= item.price;
        user.decorations.push(itemId);
        await user.save();

        res.json({
            message: `Bought ${item.name}!`,
            coins: user.coins,
            decorations: user.decorations
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
