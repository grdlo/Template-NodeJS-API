const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { UserRole } = require('../constants');

/**
 * Adding first administrator account in databse if no admin account available
 */
const seedDatabase = async () => {
    const admin = await User.find({ role : UserRole.ADMIN});
    if (Array.isArray(admin) && admin.length === 0) {
        const password = await bcrypt.hash('admin', 12);
        await User.create({
            email: 'admin@admin.com',
            password: password,
            firstName: 'admin',
            lastName: 'admin',
            role: UserRole.ADMIN
        });
    }
    return Promise.resolve(true);
};

module.exports = {
    seedDatabase
};
