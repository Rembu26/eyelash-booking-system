// Import required packages
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/authMiddleware');
app.use('/api/protected',require('./routes/authRoutes'));
const cors = require('cors');


// Create Express app
const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3001', // Frontend URL
    credentials: true
}));

// Middleware (to read JSON data)
app.use(express.json());


// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI
)
.then(() => {
    console.log("✅ MongoDB connected");
})
.catch(err => {
    console.error("❌ Connection error:", err);
});



// Import routes
const authRoutes = require('./routes/authRoutes');

app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({"You are authenticated": req.user});
});



// Use routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});