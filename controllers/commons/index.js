const login = require('./login');
const recoverPassword = require('./recoverPassword');
const resetBusinessPassword = require('./resetBusinessPassword');
const resetUserPassword = require('./resetUserPassword');
const signUp = require('./signUp');
const validateBusiness = require('./validateBusiness');
const validateUser = require('./validateUser');
module.exports = {
    login,
    signUp,
    validateUser,
    validateBusiness,
    recoverPassword,
    resetUserPassword,
    resetBusinessPassword,
};
