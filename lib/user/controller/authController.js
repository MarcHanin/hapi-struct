'use strict';

const Joi = require('joi');
const Boom = require('boom');
const User = require('../entity/user');
const Jwt = require('jsonwebtoken');
const Parameters = require('../../../config/parameters');
const MailService = require('../../mail/service/mailService');
const Bcrypt = require('bcrypt');
const Moment = require('moment');

const _privateKey = Parameters.key.privateKey;

exports.signup = {
    description: 'User registration',
    validate: {
        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    handler: (request, reply) => {
        let email = request.payload.email;
        let password = request.payload.password;
        Bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return reply(Boom.internal());
            }
            Bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reply(Boom.internal());
                }
                let user = new User({
                    email: email,
                    password: hash
                });
                user.save((err, user) => {
                    if (!err) {
                        let tokenData = {
                            email: user.email,
                            scope: [user.scope],
                            id: user._id
                        };
                        let token = Jwt.sign(tokenData, _privateKey);
                        try {
                            let templateFile = MailService.getMailTemplate('./lib/user/view/registerMail.ejs');
                            MailService
                                .sendHtmlEmail('Welcome on Hapi-Struct', templateFile, user.email, {token: token});
                            return reply({message: 'Please confirm your email address'});
                        } catch (e) {
                            console.log(e);
                            return reply(Boom.internal());
                        }
                    } else if (11000 === err.code || 11001 === err.code) {
                        return reply(Boom.forbidden('please provide another user email'));
                    } else {
                        return reply(Boom.forbidden(err));
                    }
                });
            });
        });
    }
};

exports.emailConfirmationHandle = {
    description: 'User email confirmation',
    validate: {
        query: {
            token: Joi.string().required()
        }
    },
    handler: (request, reply) => {
        let token = request.query.token;
        Jwt.verify(token, _privateKey, (err, decoded) => {
            if (decoded === undefined) {
                return reply(Boom.badRequest('Invalid verification link'));
            }
            let ttl = Parameters.key.tokenExpiration;
            let diff = Moment().diff(Moment(decoded.iat * 1000));
            if (diff > ttl) {
                return reply(Boom.badRequest('The token expired'));
            } else if (decoded.id) {
                User.findOne({_id: decoded.id}, (err, user) => {
                    if (err) {
                        return reply(Boom.internal());
                    } else if (!user) {
                        return reply(Boom.badRequest('Invalid verification link'));
                    } else {
                        user.isVerified = true;
                        user.save((err) => {
                            if (err) {
                                return reply(Boom.internal());
                            } else {
                                return reply({message: 'Your account has been verified'});
                            }
                        });
                    }
                });
            } else {
                return reply(Boom.badRequest('Invalid verification link'));
            }
        });
    }
};

exports.signin = {
    description: 'User signin process',
    validate: {
        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },
    handler: (request, reply) => {
        let email = request.payload.email;
        let password = request.payload.password;

        User.findOne({email: email}, (err, user) => {
            if (err) {
                return reply(Boom.internal('Error retrieving user'));
            }
            if (user && user.isVerified) {
                Bcrypt.compare(password, user.password, (err, res) => {
                    if (err) {
                        return reply(Boom.internal('Bcrypt comparison error'));
                    }
                    if (res) {
                        let tokenData = {
                            email: user.email,
                            scope: [user.scope],
                            id: user._id,
                            authLink: true
                        };
                        let token = Jwt.sign(tokenData, _privateKey);
                        return reply({token: token});
                    } else {
                        return reply(Boom.badRequest('Bad credentials'));
                    }
                });
            } else if (user && !user.isVerified) {
                return reply(Boom.forbidden('You must verify your email address'));
            } else {
                return reply(Boom.badRequest('Bad credentials'));
            }
        });
    }
};

exports.resendVerification = {
    description: 'Resend email verification link',
    validate: {
        payload: {
            email: Joi.string().email().required()
        }
    },
    handler: (request, reply) => {
        let email = request.payload.email;

        User.findOne({email: email}, (err, user) => {
            if (err) {
                return reply(Boom.internal('Error retrieving user'));
            }
            if (user && !user.isVerified) {
                let tokenData = {
                    email: user.email,
                    scope: [user.scope],
                    id: user.id
                };
                let token = Jwt.sign(tokenData, _privateKey);
                try {
                    let templateFile = MailService.getMailTemplate('./lib/user/view/resendVerificationMail.ejs');
                    MailService.sendHtmlEmail('Verification link', templateFile, user.email, {token: token});
                    return reply({
                        message: 'Verification link was resent'
                    });
                } catch (e) {
                    console.log(e);
                    return reply(Boom.internal());
                }
            } else if (!user) {
                return reply(Boom.notFound('No user with this email was found'));
            } else {
                return reply(
                    Boom.badRequest('Email is already verified'));
            }
        });
    }
};
