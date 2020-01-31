/** npm package - go at http://npmjs.org/ for more information about each package */
const { Router } = require('express');

/** custom import */
const user = require('./users/user');
const company = require('./companies/company');
const server = require('./servers/server');
const auth = require('./auth/auth');
const group = require('./groups/group');

const router = new Router();

/**
 * Registering all available routes
 */
router.use('/auth', auth);
router.use('/users', user);
router.use('/groups', group);
router.use('/companies', company);
router.use('/servers', server);

module.exports = router;
