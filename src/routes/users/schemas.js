/** npm package - go at http://npmjs.org/ for more information about each package */
const { Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

/** custom import */
const { UserRole } = require('../../constants');

const createUserSchema = Joi.object().keys({
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().min(6),
  company: Joi.objectId(),
  role: Joi.string().valid([UserRole.USER, UserRole.ADMIN]),
});

const updateUserSchema = Joi.object().keys({
  email: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  password: Joi.string().min(6),
  role: Joi.string().valid([UserRole.USER, UserRole.ADMIN])
});

const userIdSchema = Joi.object().keys({
  id: Joi.objectId().required(),
});

const getUsersWithFilterQueryParamSchema = Joi.object().keys({
  role: Joi.string().optional(),
  email: Joi.string().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional()
});

module.exports = {
  getUsersWithFilterQueryParamSchema,
  createUserSchema,
  updateUserSchema,
  userIdSchema
};
