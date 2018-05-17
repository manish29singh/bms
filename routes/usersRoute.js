var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
var passport = require('../configurations/passport/strategiesConfig');
var middleware = require('../middlewares/index')


// Register
router.get('/profile-details',middleware.ensureAuthenticated, userController.UserDetails);
router.post('/profile-details', userController.UserDetails);

router.get('/profile-details/:id',middleware.ensureAuthenticated, userController.getUserDetails);
//router.put('/profile-details/:id', middleware.ensureAuthenticated, userController.updateUserDetail);
router.post('/update-profile-details', middleware.ensureAuthenticated, userController.updateUserDetail);

router.get('/delete-user/:id', userController.deleteUser);
router.post('/re-invite', userController.reInvite);


module.exports = router;