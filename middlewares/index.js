const canEditUser = require('./canEditUser');
const isAuth = require('./isAuth');
const userExists = require('./userExists');

module.exports = {
    isAuth,
    userExists,
    canEditUser,
};
