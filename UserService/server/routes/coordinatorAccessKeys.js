let express = require('express');
let router = express.Router();
let keygenerator = require('keygenerator');
let CoordinatorAccessKey = require('../models/CoordinatorAccessKey');
let checkCoordinatorToken = require('./checkCoordinatorToken');
let uuid = require('uuid/v4');

router.post('/', checkCoordinatorToken, (req, res) => {
    let accessKey = new CoordinatorAccessKey({
        id: uuid(),
        key: keygenerator._()
    });

    accessKey.save((err) => {
        if (err) throw err;

        res.status(201).json({
            message: 'Key Successfully Created',
            coordinatorAccessKey: {
                id: accessKey.id,
                key: accessKey.key
            }
        });
    });
})

router.get('/', checkCoordinatorToken, (req, res) => {
    CoordinatorAccessKey.find({}, (err, accessKeys) => {
        res.status(200).json({
            message: 'Retrieved all Coordinator Keys',
            coordinatorAccessKeys: accessKeys.map((accessKey) => ({
                id: accessKey.id,
                key: accessKey.key
            }))
        })
    });
});

router.delete('/:id', checkCoordinatorToken, (req, res) => {
    CoordinatorAccessKey.remove({
        id: req.params.id
    }, (err) => {
        if (err) throw err;

        res.status(200).json({
            message: 'Coordinator Key Removed'
        });
    });
});

module.exports = router;
