const canEditUser = require('./canEditUser');
const userIsAuth = require('./userIsAuth');
const userExists = require('./userExists');
const canEditBusiness = require('./canEditBusiness');
const businessExists = require('./businessExists');
const businessIsAuth = require('./businessIsAuth');

module.exports = {
    userIsAuth,
    userExists,
    canEditUser,
    businessIsAuth,
    canEditBusiness,
    businessExists,
};
