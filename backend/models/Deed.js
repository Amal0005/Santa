const mongoose = require('mongoose');

const DeedSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, required: true },
    coinValue: { type: Number, required: true }, // 10, 25, 50
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Deed', DeedSchema);
