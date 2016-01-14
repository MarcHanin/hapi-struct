'use strict';

const Assert = require('chai').assert;
const Parameters = require('../config/parameters');
const Server = require('../config/server');
const Superagent = require('superagent');
const Jwt = require('jsonwebtoken');
const User = require('../lib/user/entity/user');

const _serverPath = "http://localhost:" + Parameters.server.port;
const _privateKey = Parameters.key.privateKey;
const _facticeUser = {
    email: 'yourEmail@yourDomain.com',
    password: 'toto'
};

describe('auth controller', () => {

    before((done) => {
        User.findOne({email: _facticeUser.email}, (err, user) => {
            if (err) {
                throw err;
            }
            if (user) {
                user.remove((err) => {
                    if (err) {
                        throw err;
                    }
                    return done();
                })
            } else {
                return done();
            }
        });
    });

    beforeEach((done) => {
        Server.start((err) => {
            return done(err);
        });
    });

    describe('Signup', () => {
        it('signup', (done) => {
            Superagent
                .post(_serverPath + "/api/auth/signup")
                .send({email: _facticeUser.email, password: _facticeUser.password})
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }
                    Assert.equal(res.status, 200);
                    return done();
                });
        });
    });

    describe('Resend verification', () => {
        it('resend verification', (done) => {
            Superagent
                .post(_serverPath + "/api/auth/resendverification")
                .send({email: _facticeUser.email})
                .end((err, res) => {
                    if (err) {
                        throw err;
                    }
                    Assert.equal(res.status, 200);
                    return done();
                });
        });
    });

    describe('Signin', () => {
        it('Bad signin', (done) => {
            Superagent
                .post(_serverPath + "/api/auth/signin")
                .send({email: 'ahdezferzzergergezrg@nodejs.com', password: 'badPassword'})
                .end((err, res) => {
                    if (err) {
                        Assert.equal(res.status, 400);
                        Assert.equal(err.message, 'Bad Request');
                        return done();
                    }
                    return done(new Error("No error for bad signin"));
                });
        });

        it('Email not validated', (done) => {
            Superagent
                .post(_serverPath + "/api/auth/signin")
                .send({email: _facticeUser.email, password: _facticeUser.password})
                .end((err, res) => {
                    if (err) {
                        Assert.equal(res.status, 403);
                        Assert.equal(err.message, 'Forbidden');
                        return done();
                    }
                    return done(new Error("No error for email not validated"));
                });
        });
    });

    describe('Verification', () => {
        it('Email verification', (done) => {
            User.findOne({email: _facticeUser.email}, (err, user) => {
                if (err) {
                    throw err;
                }
                if (!user) {
                    return done(new Error("No user found"));
                } else {
                    let tokenData = {
                        email: user.email,
                        scope: [user.scope],
                        id: user._id
                    };
                    let token = Jwt.sign(tokenData, _privateKey);
                    Superagent
                        .get(_serverPath + "/api/auth/confirmation")
                        .query({token: token})
                        .end((err, res) => {
                            Assert.equal(res.status, 200);
                            return done();
                        });
                }
            });
        });

        it('Bad token for email validation', (done) => {
            Superagent
                .get(_serverPath + "/api/auth/confirmation")
                .query({token: "MyBeautifulBadToken"})
                .end((err, res) => {
                    if (err) {
                        Assert.equal(res.status, 400);
                        return done();
                    }
                    return done(new Error("No error for bad token"));
                });
        });

        it('No token for email validation', (done) => {
            Superagent
                .get(_serverPath + "/api/auth/confirmation")
                .end((err, res) => {
                    if (err) {
                        Assert.equal(res.status, 400);
                        return done();
                    }
                    return done(new Error("No error for empty token"));
                });
        });
    });

    afterEach((done) => {
        Server.stop((err) => {
            return done(err);
        });
    });

    after((done) => {
        User.findOne({email: _facticeUser.email}, (err, user) => {
            if (err) {
                throw err;
            }
            if (user) {
                user.remove((err) => {
                    if (err) {
                        throw err;
                    }
                    return done();
                })
            } else {
                return done();
            }
        });
    });
});
