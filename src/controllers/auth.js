const HTTPError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwtHelper = require('../helpers/jwt');
const userModel = require('../models/user');

/***
 * Authenticate a user with specific credentials
 * @param {Object} credentials user credentiels for authentification (email + password)
 */
exports.login = (credentials) => {
    /** Find if user exist in database */
    return userModel.findOne(
        { email: credentials.email }
    ).then(user => {
        if (!user)
            /** Throw error (handled in route) with not found http code */
            throw HTTPError.Unauthorized('Authentification Failed');
            /** Compare user password with database crypted password */
        return Promise.all([user.view(), bcrypt.compare(credentials.password, user.password)]);
    }).then(([user, compareResult]) => {
        if (compareResult) {
            /** If authentification success, create jwt and return it with user profile */
            const jwtToken = jwtHelper.signSync(user.id);
            return { user, jwtToken };
        }
        /** Throw error (handled in route) with not found http code */
        throw HTTPError.Unauthorized('Authentification Failed');
    });
};
