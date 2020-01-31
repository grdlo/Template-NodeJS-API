/** npm package - go at http://npmjs.org/ for more information about each package */
const express = require('express');
const { celebrate } = require('celebrate');

/** custom import */
const JoiSchema = require('./schemas');
const authController = require('../../controllers/auth');
const { handleHttpError } = require('../../helpers/errors');

const Router = express.Router();

/**
 * @method GET
 * @parameters Body required with user credentials
 */
Router.post('/',
    celebrate({
        body: JoiSchema.authSchema
    }),
    async (req, res, next) => {
        try {
            const { jwtToken, user } = await authController.login(req.body);
            /** return user profile and jwt of the user */
            res.status(200).json({
                jwt: jwtToken,
                user: user
            });
        } catch (err) {
            /** Handle error of controller */
            handleHttpError(err, res, next);
        }
    });

module.exports = Router;