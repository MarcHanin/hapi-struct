'use strict';

// Dependencies
const Mongoose = require('mongoose');
const AutoIncrement = require('mongoose-auto-increment');
const Database = require('../../../config/database');

AutoIncrement.initialize(Database);

const UserSchema = new Mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    scope: {
        type: String,
        enum: ['Customer'],
        default: ['Customer'],
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

UserSchema.plugin(AutoIncrement.plugin, {
    model: 'User',
    field: '_id'
});

module.exports = Mongoose.model('user', UserSchema);
