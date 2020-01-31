/** npm package - go at http://npmjs.org/ for more information about each package */
const mongoose = require('mongoose');

/** custom import */
const {UserRole, UserRoles} = require('../constants');

const Schema = mongoose.Schema;

/** Creating user schema */
const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: UserRoles,
        default: UserRole.USER
    }
});

userSchema.methods = {
    /** Formate object for a express.js response (remove some information) */
    async view() {
        let view = {};
        let fields = ['id', 'username', 'role', 'email', 'firstName', 'lastName'];
        fields.forEach((field) => {
            view[field] = this[field];
        });
        return view;
    }
};

module.exports = mongoose.model('User', userSchema);
