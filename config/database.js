'use strict';

// Dependencies
const Mongoose = require('mongoose');

// Configurations
const parameters = require('./parameters.json');

Mongoose.connect('mongodb://' + parameters.database.host + '/' + parameters.database.db);

const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => {
    console.log('Connection with database succeeded');
});

module.exports = db;
