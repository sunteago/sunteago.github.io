const express = require('express');
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const router = express.Router();
const isAuth = require('../middleware/isAuth');
const { strongPw, validUser } = require('../helpers/validators');
// /auth/...


router.post('/create-account', [
    check('username').matches(validUser).withMessage('Username is not valid'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('name').isAlpha().withMessage('Name is not valid'),
    check('password').matches(strongPw).withMessage('Password is weak or not valid')
], authController.createAccount);

router.post('/log-in', authController.logIn);

router.get('/user', isAuth, authController.getAuthenticatedUser);


module.exports = router;