const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Deed = require('../models/Deed');
const auth = require('../middleware/auth');

// Get Missions & Streak Data
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('streak lastMissionDate completedMissions coins niceMeter stickersUnlocked');

        // Check for daily reset
        const today = new Date().toISOString().split('T')[0];
        if (user.lastMissionDate !== today) {
            user.completedMissions = [];
            // If missed yesterday (and not just first time), reset streak
            if (user.lastMissionDate) {
                const lastDate = new Date(user.lastMissionDate);
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (user.lastMissionDate !== yesterdayStr) {
                    user.streak = 0;
                }
            }
            user.lastMissionDate = today; // Update checked date
            await user.save();
        }

        const missions = [
            { id: 'mission1', description: 'Help someone without being asked', reward: 50 },
            { id: 'mission2', description: 'Make someone smile today', reward: 30 },
            { id: 'mission3', description: 'Study without distraction', reward: 40 }
        ];

        res.json({
            missions,
            streak: user.streak,
            completedMissions: user.completedMissions,
            userStats: {
                coins: user.coins,
                niceMeter: user.niceMeter,
                stickersUnlocked: user.stickersUnlocked
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Complete Mission
router.post('/complete', auth, async (req, res) => {
    try {
        const { missionId, reward } = req.body;
        const user = await User.findById(req.user._id);
        const today = new Date().toISOString().split('T')[0];

        // Validation
        if (user.completedMissions.includes(missionId)) {
            return res.status(400).json({ message: 'Mission already completed' });
        }

        // Update Stats
        user.coins += reward;
        user.niceMeter = Math.min(100, user.niceMeter + 5);
        user.completedMissions.push(missionId);
        user.lastMissionDate = today;

        // Streak Logic: If first mission of the day, increment streak
        // Note: Logic simplified as we handle reset in GET. 
        // We only increment user.streak if user hasn't completed any missions *today* yet? 
        // No, usually streak is "did created at least 1 deed/mission every day".
        // Let's rely on checking if this is the first mission of today.
        // Since we clear completedMissions on new day in GET, checking user.completedMissions.length === 1 (after push) works.
        if (user.completedMissions.length === 1) {
            user.streak += 1;
        }

        // Streak Rewards
        let newSticker = null;
        if (user.streak === 3 && !user.stickersUnlocked.includes('silver-star')) {
            user.stickersUnlocked.push('silver-star');
            newSticker = 'Silver Star ⭐';
        }
        if (user.streak === 7 && !user.stickersUnlocked.includes('gold-badge')) {
            user.stickersUnlocked.push('gold-badge');
            newSticker = 'Golden Santa Badge 🥇';
        }
        if (user.streak === 15 && !user.stickersUnlocked.includes('kindness-hero')) {
            user.stickersUnlocked.push('kindness-hero');
            newSticker = 'Kindness Hero Badge 👑';
        }

        await user.save();

        res.json({
            message: 'Mission Completed!',
            coins: user.coins,
            niceMeter: user.niceMeter,
            streak: user.streak,
            completedMissions: user.completedMissions,
            newSticker
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
