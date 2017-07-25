let express = require('express');
let router = express.Router();
let User = require('../models/User');
let bcrypt = require('bcrypt-nodejs');
let uuid = require('uuid/v4');
let jwt = require('jsonwebtoken');
let config = require('../config');
let checkCoordinatorToken = require('./checkCoordinatorToken');
let CoordinatorAccessKey = require('../models/CoordinatorAccessKey');

let createToken = (user) => {
    return jwt.sign({
        user_type: user.user_type,
        user_id: user.id
    }, config.secret);
};

router.post('/sign-up', (req, res) => {
    User.findOne({
        email: req.body.email,
        user_type: 'ta-coordinator'
    }, (err, existingUser) => {
        if (err) throw err;

        if (existingUser) {
            res.status(409).json({
                message: 'Sign Up Error: User with email '+req.body.email+' already exists.'
            });
        } else {
             bcrypt.hash(req.body.password, bcrypt.genSaltSync(10), null, (err, hashed) => {
                 if (err) throw err;

                 CoordinatorAccessKey.findOne({
                     key: req.headers['x-coordinator-account-key']
                 }, (err, coordinatorAccessKey) => {
                    if (err) throw err;

                    if (!coordinatorAccessKey && req.headers['x-coordinator-account-key'] !== config.WILDCARD_ACCOUNTKEY) {
                        res.status(401).json({
                            message: 'Invalid coordinator sign up key'
                        });
                    } else {
                        let user = new User({
                            id: uuid(),
                            email: req.body.email,
                            password: hashed,
                            user_type: 'ta-coordinator'
                        });

                        user.save((err) => {
                            if (err) throw err;

                            let token = createToken(user);

                            if (coordinatorAccessKey) {
                                coordinatorAccessKey.remove();
                            }

                            res.status(201).json({
                                message: 'Sign Up Successful',
                                user: {
                                    id: user.id,
                                    email: user.email,
                                    user_type: 'ta-coordinator',
                                    user_token: token
                                }
                            });
                        });
                    }
                 });
             });
        }
    });
});

router.post('/authenticate', (req, res) => {
    User.findOne({
        email: req.body.email,
        user_type: 'ta-coordinator'
    }, (err, user) => {
        if (err) throw err;

        if (!user) {
            res.status(404).json({
                message: 'No coordinator user with that email'
            });
        } else {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) throw err;

                if (!result) {
                    res.status(401).json({
                        message: 'Unsuccessful Authentication: Wrong password'
                    });
                } else {
                    let token = createToken(user);

                    res.status(200).json({
                        message: 'Authentication Successful',
                        user: {
                            id: user.id,
                            email: user.email,
                            user_type: user.user_type,
                            user_token: token
                        }
                    });
                }
            });
        }
    });
});

router.post('/check-token', checkCoordinatorToken, (req, res) => {
    res.status(200).json({
        message: 'Token Successfully Verified',
        decodedToken: res.decodedToken
    });
});

module.exports = router;
