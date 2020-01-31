/** npm package - go at http://npmjs.org/ for more information about each package */
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { errors } = require('celebrate');

/** custom import */
const routesManager = require('../../routes');
const errorHelper = require('../../helpers/errors');

exports.setupApp = () => {
    const app = express();

    /** adding morgan log if in development environement */
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    /** Body content formater */
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    /** Header content formater */
    app.use((req, res, next) => {
        /** req.data initialized for passing data through middlewares */
        req.data = {};
        /** allow access from all origin */
        res.setHeader('Access-Control-Allow-Origin', '*');
        /** allow all methods on the API */
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return next();
    });

    /** referencing routes (all route are write in src/routes/index.js) */
    app.use('/', routesManager);


    /** adding celebrate error route */
    app.use(errors());

    /** adding in api error route */
    app.use(function (error, req, res, next) {
        if (error.name === 'MongoError' && error.code === 11000) {
            console.log('MongoError', error.keyPattern);
            res.status(400).json({
                message: 'There was a duplicate key error for these fields: ' + Object.keys(error.keyPattern)
            });
        } else if (error instanceof SyntaxError) {
            res.status(error.statusCode || 400).json({
                message: error.message || 'The syntax of the query is incorrect'
            });
        } else {
            console.log(error);
            next();
        }
    });

    /** adding in api custom error route */
    app.use(errorHelper.customErrorHandler());

    return app;
};


