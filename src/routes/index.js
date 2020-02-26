/** npm package - go at http://npmjs.org/ for more information about each package */
const { Router } = require('express');

/** custom import */
const user = require('./users/user');
const auth = require('./auth/auth');

const router = new Router();

/**
 * Registering all available routes
 */
router.use('/auth', auth);
router.use('/users', user);

module.exports = router;
