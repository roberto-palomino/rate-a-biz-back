const canEditUser = require('./canEditUser');
const userIsAuth = require('./userIsAuth');
const userExists = require('./userExists');
const canEditBusiness = require('./canEditBusiness');
const businessExists = require('./businessExists');
const businessIsAuth = require('./businessIsAuth');
const canEditReview = require('./canEditReview');

module.exports = {
    userIsAuth,
    userExists,
    canEditUser,
    businessIsAuth,
    canEditBusiness,
    businessExists,
    canEditReview,
};
