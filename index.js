const express = require('express');
const { connect, connection } = require('./config/connection'); // Import the connection setup
const userRoutes = require('./routes/userRoutes'); // Import user routes
const thoughtRoutes = require('./routes/thoughtRoutes'); // Import thought routes

const app = express(); // Create the express app instance
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the imported routes
app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);

// Start the server
app.listen(PORT, () => console.log(`Connected on localhost:${PORT}`));

// Export the connection object for use in other modules if needed
module.exports = connection;
