const jwt = require('jsonwebtoken');

exports.tokenSigner = async user => {
    return await jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '1h' });
};