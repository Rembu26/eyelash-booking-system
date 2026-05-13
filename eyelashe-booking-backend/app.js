// // Import required packages
// require('dotenv').config();

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authMiddleware = require('./middleware/authMiddleware');

// // Import routes
// const authRoutes = require('./routes/authRoutes');

// // Create Express app
// const app = express();

// // Middleware
// app.use(cors({
//     origin: 'http://localhost:3001', // Frontend URL
//     credentials: true
// }));
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
// .then(() => {
//     console.log("✅ MongoDB connected");
// })
// .catch(err => {
//     console.error("❌ Connection error:", err);
// });

// // Routes
// app.use('/api/auth', authRoutes); // Login, Register live here

// // Example protected route - keep this OR move it to authRoutes.js
// app.get('/api/protected', authMiddleware, (req, res) => {
//     res.json({ message: "You are authenticated", user: req.user });
// });

// // Start server
// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
// });




require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ Connection error:", err));

app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});