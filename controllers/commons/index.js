const login = require('./login');
const recoverPassword = require('./recoverPassword');
const resetUserPassword = require('./resetUserPassword');
const signUp = require('./signUp');
const validateUser = require('./validateUser');
const getReview = require('./getReviews');
module.exports = {
    login,
    signUp,
    validateUser,
    recoverPassword,
    resetUserPassword,
    getReview,
};
