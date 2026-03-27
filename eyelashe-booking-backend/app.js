// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/authMiddleware');
const cors = require('cors');

require('dotenv').config();


// Import routes
const authRoutes = require('./routes/authRoutes');

// Create Express app
const app = express();

// Enable CORS
app.use(cors({
    origin: 'http://localhost:3001', // Frontend URL
    credentials: true
}));

app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({"You are authenticated": req.user});
});

// Middleware (to read JSON data)
app.use(express.json());

// MongoDB connection string
const uri = "mongodb+srv://rembuluwanim4_db_user:RMGhLWZfOjVJQC4W@eyelashes-db.f1za9xs.mongodb.net/test?retryWrites=true&w=majority";

// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("✅ MongoDB connected");
})
.catch(err => {
    console.error("❌ Connection error:", err);
});

// Use routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});