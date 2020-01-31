const jwt = require('jsonwebtoken');
const config = require('config');

const JWT_TOKEN = config.get('auth.JWT_TOKEN');
const jwtExpiration = config.get('auth.tokenExpiration');

const signSync = (id) => (jwt.sign({id}, JWT_TOKEN, {expiresIn: jwtExpiration}));

const generateDaemonToken = (server) => (jwt.sign({server: server.id}, JWT_TOKEN, {expiresIn: jwtExpiration}));

const verify = (token) => jwt.verify(token, JWT_TOKEN);

module.exports = {
    signSync,
    generateDaemonToken,
    verify
};
