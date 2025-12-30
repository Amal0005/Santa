const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    coins: { type: Number, default: 0 },
    niceMeter: { type: Number, default: 0 }, // 0 to 100
    stickersUnlocked: [{ type: String }], // 'sticker1', 'sticker2', 'badge'
    deeds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deed' }],
    avatar: { type: String, default: 'santa' },
    streak: { type: Number, default: 0 },
    lastMissionDate: { type: String, default: null }, // Store as YYYY-MM-DD
    completedMissions: [{ type: String }], // Store mission IDs for current day
    letters: [{
        content: String,
        date: { type: Date, default: Date.now }
    }],
    decorations: [{ type: String }] // 'star', 'lights', 'ball-red', 'gift'
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
