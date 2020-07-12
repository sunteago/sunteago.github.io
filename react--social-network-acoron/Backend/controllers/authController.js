const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { tokenSigner } = require('../helpers/tools');
require("dotenv").config({ path: "variables.env" });

exports.createAccount = async (req, res, next) => {
    const { username, password, email, name } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Problem creating account', errors: errors.array() });
    }
    try {
        const emailExists = await User.find({ email: email });
        const userExists = await User.find({ username: username });
        const errors = []
        if (emailExists.length ) {
            errors.push({ msg: 'There is already an user with that email address', value: 'email'});
        }
        if (userExists.length) {
            errors.push({msg: 'There is already a user registered with that username', value: 'user'})
        }
        if (errors.length) return res.status(409).json({ errors });


        const hashedPw = await bcrypt.hash(password, 12);
        const user = new User({ username, password: hashedPw, email, name });
        const createdUser = await user.save();
        const token = await tokenSigner(createdUser);

        //borrar datos sensibles
        const returnedUser = createdUser._doc;
        delete returnedUser.password;

        res.status(201).json({ message: 'User created', token, user: returnedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'An Error has occurred' });
    }
};

exports.logIn = async (req, res, next) => {
    const { email, password } = req.body.user;
    try {
        const user = await User.findOne({ email });
        if (!user) res.status(404).json({ message: 'There is no registered user with that email' });

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) res.status(403).json({ message: 'Password is incorrect' });

        const returnedUser = user._doc;
        delete returnedUser.password;

        const token = await tokenSigner(user);
        res.status(200).json({ message: 'Logged in successfully', token, user: returnedUser });
    } catch (err) {
        console.log('ERROR:', err);
        res.status(402).json({ err });
    }
};

exports.getAuthenticatedUser = async (req, res, next) => {
    const userId = req.user.userId;
    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            res.status(404).json({ msg: 'The user does not exist' });
        }
        res.status(200).json({ user: { user } });
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: 'Server problem' })
    }
};

