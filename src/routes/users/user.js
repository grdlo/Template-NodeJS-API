/** npm package - go at http://npmjs.org/ for more information about each package */
const express = require('express');
const { celebrate } = require('celebrate');

/** custom import */
const { authenticator } = require('../../middlewares/authenticator');
const userController = require('../../controllers/user');
const JoiSchema = require('./schemas');
const { handleHttpError } = require('../../helpers/errors');
const { UserRole } = require('../../constants');

const Router = express.Router();

/**
 * @method GET
 * @parameters No request parameters required
 * @restricted ADMIN
 */
Router.get('/',
    /** Route restricted to Admin only */
    authenticator({ roles: [UserRole.ADMIN] }),
    async (req, res, next) => {
        try {
            const users = await userController.getUsers();
            /** Return Array of user */
            res.status(200).json({
                users
            });
        } catch (err) {
            /** Handle error of controller */
            handleHttpError(err, res, next);
        }
    });


/**
 * @method GET
 * @parameters UserID required
 */
Router.get('/:id',
    celebrate({
        params: JoiSchema.userIdSchema
    }),
    /** Route restricted to authenticate request (with a jwt) */
    authenticator(),
    async (req, res, next) => {
        try {
            const user = await userController.getOneUser(req.params.id);
            /** Return user profile as an Object */
            res.status(200).json({
                user: user
            });
        } catch (err) {
            /** Handle error of controller */
            handleHttpError(err, res, next);
        }
    });

/**
 * @method POST
 * @parameters Body required with all user information
 */
Router.post('/',
    celebrate({
        body: JoiSchema.createUserSchema
    }),
    async (req, res, next) => {
        try {
            const newUser = await userController.createUser(req.body);
            /** Return created user profile as an Object */
            res.status(201).json({
                user: newUser
            });
        } catch (err) {
            /** Handle error of controller */
            handleHttpError(err, res, next);
        }
    });

/**
 * @method PUT
 * @parameters UserID and field to update required in body 
 */
Router.put('/:id',
    celebrate({
        params: JoiSchema.userIdSchema,
        body: JoiSchema.updateUserSchema
    }),
    /** Route restricted to authenticate request (with a jwt) */
    authenticator(),
    async (req, res, next) => {
        try {
            const updatedUser = await userController.updateUser(req.params.id, req.body);
            /** Return updated user profile as an Object */
            res.status(200).json({
                user: updatedUser
            });
        } catch (err) {
            /** Handle error of controller */
            handleHttpError(err, res, next);
        }
    });

/**
 * @method DELETE
 * @parameters UserID required
 * @restricted ADMIN
 */
Router.delete('/:id',
    celebrate({
        params: JoiSchema.userIdSchema
    }),
    /** Route restricted to Admin only */
    authenticator({ roles: [UserRole.ADMIN] }),
    async (req, res, next) => {
        try {
            const result = await userController.removeUser(req.params.id);
            /** Return the mongodb deletion result */
            res.status(204).json({
                result
            });
        } catch (err) {
            /** Handle error of controller */
            handleHttpError(err, res, next);
        }
    });

module.exports = Router;
