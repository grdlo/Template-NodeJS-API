/** npm package - go at http://npmjs.org/ for more information about each package */
const { Joi } = require('celebrate');

const authSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().min(6)
});

module.exports = {
  authSchema
};
