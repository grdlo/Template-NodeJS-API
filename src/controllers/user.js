/** npm package - go at http://npmjs.org/ for more information about each package */
const emailValidator = require('email-validator');
const HTTPError = require('http-errors');
const bcrypt = require('bcryptjs');

/** custom import */
const User = require('../models/user');

/**
 * Return all the user profile available in the database
 */
exports.getUsers = () => {
    return User.find()
        .then(users => Promise.all(users.map(user => user.view())));
};

/**
 * Return a specific user profile
 * @param {String} userId the databse identifier of the resquested user
 */
exports.getOneUser = (userId) => {
    /** Finding user with the requested identifier */
    return User.findById(userId)
        .then(user => {
            /** Throw error (handled in route) with not found http code */
            if (!user) throw HTTPError.NotFound('user does not exist');
            return user.view();
        });
};

/**
 * Create a new user profile and save it in database
 * @param {Object} newUser the data information about the new user
 */
exports.createUser = async (newUser) => {
    if (!emailValidator.validate(newUser.email))
        throw HTTPError.BadRequest('Invalid parameters');
    /** Check if user email already exist */
    return User.findOne({
        email: newUser.email
    }).then(doc => {
        /** Throw error (handled in route) with conflict http code */
        if (doc) throw HTTPError.Conflict('Email already in use');
        /** Crypting the password of the user */
        return bcrypt.hash(newUser.password, 12);
    }).then(hashedPassword => {
        /** Create the user and store ONLY the crypted password */
        return User.create({
            ...newUser,
            password: hashedPassword,
        });
    }).then(createdUser => createdUser.view());
};

/**
 * Update a specific user profile
 * @param {String} userId the identifier of the user
 * @param {Object} updatedBody the field to update
 */
exports.updateUser = async (userId, updatedBody) => {
    /** Crypting password if updated */
    if (updatedBody.password) {
        await bcrypt.hash(updatedBody.password, 12).then(hashedPassword => {
            updatedBody.password = hashedPassword;
        });
    }
    /** Requesting user in databse for update */
    return User.findById(userId)
        .then(user => {
            /** Throw error (handled in route) with not found http code */
            if (!user) throw HTTPError.NotFound('User does not exist');
            /** Updating field of the user object */
            const updatedUser = Object.assign(user, updatedBody);
            /** Updating user object in database */
            return updatedUser.save();
        }).then(updatedUser => updatedUser.view());
};

/**
 * Delete a specific user profile
 * @param {String} userId the identifier of the user
 */
exports.removeUser = (userId) => {
    /** Removing user in databse */
    return User.deleteOne({ _id: userId })
        .then(res => {
            /** Throw error (handled in route) with not found http code */
            if (!(res.ok === 1 && res.deletedCount === 1))
                throw HTTPError.NotFound('User does not exist');
            return res;
        });
};
