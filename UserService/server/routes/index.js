let express = require('express');
let router = express.Router();
let path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).sendFile(path.resolve(__dirname, '..', '..', 'client', 'build', 'index.html'));
});

module.exports = router;
