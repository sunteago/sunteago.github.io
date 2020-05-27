const jwt = require('jsonwebtoken');
require("dotenv").config({ path: "variables.env" });

module.exports = (req, res, next) => {
    try {
        const tokenHeader = req.get('X-Auth-Token');
        if (!tokenHeader) {
            res.status(401).json({message: 'No permission granted'});
        }
        const crypted = jwt.verify(tokenHeader, process.env.SECRET);
        console.log("crypted:", crypted);
        req.user = crypted;
        next();
    } catch(err) {
        res.status(401).json({message: err});
    }
    
}