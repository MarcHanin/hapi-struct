Hapi Struct
===

## Description

Hapi Struct is a boilerplate for Hapi framework. This boilerplate has been created to help you to create a new project with Hapi.

## Required
- **NodeJS** - >= 5.3.0 - To run your app
- **MongoDB** - >= 3.2.0 - NoSQL Database
- **Gulp** - >= 3.9.0 - JavaScript task runner

## Project
### Structure

```
.
├── index.js                                    * Entry point of the application
├── gulpfile.js                                 * Gulp configuration
├── .jscsrc                                     * Jscs configuration
├── package.json
├── config/
|   └── auth.js                                 * Authentication configuration
|   └── database.js                             * Database configuration
|   └── parameters.json                         * Application parameters
|   └── routes.js                               * Routes configuration
|   └── server.js                               * Server configuration
├── lib/
|   ├── mail/
|   |   └── service/
|   |      └── mailService.js                   * Mail service
|   └── user/
|       ├── controller
|       |   └── authController.js               * Authentication controller
|       ├── entity
|       |   └── user.js                         * User entity
|       ├── view
|       |   ├── registerMail.ejs                * Email sent when a user registration
|       |   └── resendVerificationMail.ejs      * Email sent to resend mail verification
|       └── routes.js                           * Management of the user's route
└── test/
    └── authControllerSpec.js                   * authController tests
```

### dependencies
- **bcrypt** - ^0.8.5 - Bcrypt library for NodeJS
- **boom** - ^3.1.1 - Http-friendly error objects
- **ejs** - ^2.3.4 - Embedded JavaScript templates
- **gulp** - ^3.9.0 - The streaming build system
- **gulp-jscs** - ^3.0.2 - Check JavaScript code style with jscs
- **gulp-nodemon** - ^2.0.6 - Gulp implementation for nodemon
- **hapi** - ^12.0.0 - HTTP Server framework
- **hapi-auth-jwt2** - ^5.3.1 - Hapi Authentication Plugin/Scheme using JWT
- **joi** - ^7.1.0 - Object schema validation
- **jsonwebtoken** - ^5.5.4 - JSON Web Token implementation
- **moment** - ^2.11.0 - Parse, validate, manipulate and display dates
- **mongoose** - ^4.3.4 - MongoDB ODM
- **mongoose-auto-increment** - ^5.0.1 - auto-increment any field on any mongoose schema that you wish
- **nodemailer** - ^1.11.0 - Easy as cake e-mail sending from your Node.js applications

## How to run this project

### Configuration
Firstly, you need to configure the application
```JSON
// config/parameters.json

{
  "server": {
    "host": "127.0.0.1",                        
    "port": 3000
  },
  "database": {
    "host": "127.0.0.1",
    "port": 27017,
    "db": "YourDataBaseName",
    "username": "YourDataBaseUserName",
    "password": "YourDatabasePassword"
  },
  "key": {
    "privateKey": "YourPrivateKey",
    "tokenExpiration": 3600000,
    "tokenExpirationDescription": "1 hour"
  },
  "mail": {
    "email": "senderMail@website.com",
    "userName": "YourMailAccount",
    "password": "YourMailPassword"
  }
}
```

### Install dependencies
```sh
  npm install
```

### Run the application
```sh
  npm start
```

### Run tests
```sh
  npm test
```
