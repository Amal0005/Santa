const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection
// Removed deprecated options
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/santa_wallet')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/deed', require('./routes/deed'));
app.use('/api/user', require('./routes/user'));
app.use('/api/missions', require('./routes/missions'));
app.use('/api/letters', require('./routes/letters'));
app.use('/api/tree', require('./routes/tree'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
