const AuthController = require('./controller/auth.controller');

module.exports = [
    {path: '/api/auth/signup', method: 'POST', config: AuthController.signup},
    {path: '/api/auth/confirmation', method: 'GET', config: AuthController.emailConfirmationHandle},
    {path: '/api/auth/signin', method: 'POST', config: AuthController.signin},
    {path: '/api/auth/resendverification', method: 'POST', config: AuthController.resendVerification}
];
