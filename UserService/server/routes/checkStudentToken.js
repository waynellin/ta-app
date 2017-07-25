let jwt = require('jsonwebtoken');
let config = require('../config');

module.exports = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.redirect(401, '/');
            } else {
                console.log(decoded);
                if (decoded.user_type !== 'student') {
                    res.status(401).send();
                } else {
                    res.decodedToken = decoded;
                    next();
                }
            }
        });

    } else {
        return res.status(403).send();
    }
}