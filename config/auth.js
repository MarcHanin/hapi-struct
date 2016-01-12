'use strict';

// Dependencies
const HapiAuthJwt = require('hapi-auth-jwt2');
const Parameters = require('./parameters');
const Moment = require('moment');
const User = require('../lib/user/entity/user');

function validate(decoded, token, cb) {
    let ttl = Parameters.key.tokenExpiration;
    let diff = Moment().diff(Moment(token.iat * 1000));

    if (decoded.authLink) {
        if (diff > ttl) {
            return callback(null, false);
        }

        User.findOne({_id: decoded.id}, (err, user) => {
            if (err) {
                return cb(err, false);
            } else if (!user) {
                return cb(null, false);
            } else if (user.isVerified) {
                return cb(null, true, user);
            } else {
                return cb(null, false);
            }
        });
    } else {
        return cb(null, false);
    }
}

// Auth jwt plugin
const register =  (server, options, next) => {
    server.register(HapiAuthJwt, (err) => {
        if (err) {
            return next(err);
        }

        server.auth.strategy('jwt', 'jwt', {
            key: Parameters.key.privateKey,
            validateFunc: validate
        });

        return next();
    });
};

register.attributes = {
    name: 'auth-jwt',
    version: '1.0.0'
};

module.exports = register;
