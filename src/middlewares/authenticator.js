/** npm package - go at http://npmjs.org/ for more information about each package */
const HTTPError = require('http-errors');

/** custom import */
const User = require('../models/user');
const errorHelper = require('../helpers/errors');
const jwtHelper = require('../helpers/jwt');

/**
 * 
 * @param {Enumerator} roles Current role of the requester 
 */
const authenticator = ({roles} = {}) => async (req, res, next) => {
    try {
        let token = req.headers['authorization'];
        /** Removing bearer for reading token */
        if (token && token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        /** Decoding token and retrive information */
        const decoded = jwtHelper.verify(token);
        /** Find user in database */
        await User.findById(decoded.id)
            .then(user => {
                /** Throw error (handled in this middleware) with unauthorized http code */
                if (!user) throw HTTPError.Unauthorized('Access Forbidden');
                /** Throw error (handled in this middleware) with unauthorized http code */
                if (roles && roles.indexOf(user.role) === -1) throw HTTPError.Unauthorized('This user doesn\'t have the permissions to access this route');
                req.user = user;
                return next();
            });
    } catch (error) {
        /** process error received */
        if (error instanceof HTTPError.HttpError) {
            errorHelper.handleHttpError(error, res, next);
        } else {
            /** in case of no HttpError code return specific 401 Unauthorized error code */
            return res.status(401).json({
                message: error.message
            });
        }
    }
};

module.exports = {
    authenticator
};
