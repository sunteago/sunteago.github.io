const isAuth = require('../middleware/isAuth');
const express = require('express');
const router = express.Router();
const userDataController = require('../controllers/userDataController');
const { avatarMulter } = require('../middleware/multer');



// user
router.post(
    '/settings',
    isAuth,
    avatarMulter,
    userDataController.postUserSettings);

//user/...
router.get('/:accountId', userDataController.getUserProfile);

module.exports = router;