'use strict';

// Dependencies
const Hapi = require('hapi');

// Configurations files
const parameters = require('./parameters');
const auth = require('./auth');
const routes = require('./routes');

const server = new Hapi.Server();
const plugins = [];

server.connection({
    host: parameters.server.host,
    port: parameters.server.port
});

// Plugins management
plugins.push({register: auth});
server.register(plugins, (err) => {
    if (err) {
        throw err;
    }
    console.log('server plugins was successfull loaded');
});

server.route(routes);

module.exports = server;
