const {HttpError} = require('http-errors');

/**
 * 
 * @param {object} err HttpError object instance
 * @param {object} res the response object of express.js
 * @param {object} next the following middleware to call
 */
const handleHttpError = (err, res, next) => {
    if (err instanceof HttpError) {
        if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development')
            console.log(err);
        return res.status(err.statusCode).json({
            message: err.message
        });
    } else {
        return next(err);
    }
};

/**
 * @param {object} err HttpError object instance
 * @param {object} res the response object of express.js
 */
const customErrorHandler = () => (err, res) => {
    if (err) {
        console.log(err.name);
        if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development')
        res.status(err.statusCode || 500).json({
            message: err.message || 'An internal error occured'
        });
    }
};

module.exports = {
    handleHttpError,
    customErrorHandler
};
