const { connect, connection } = require('mongoose');

const connectionString = 'mongodb://127.0.0.1:27017/usersDB';

// Establish the connection
connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Export the connection object for use in other modules
module.exports = connection;
