let rp = require('request-promise');

module.exports = (req, res, next) => {
  let args = {
    method: 'POST',
    uri: 'http://localhost:3002/students/check-token',
    headers: {
      'x-access-token': req.body.token || req.query.token || req.headers['x-access-token']
    }
  }
  rp(args)
    .then((data) => {
      next();
    })
    .catch((err) => {
      res.status(401).json({
        message: 'Authentication Failed: Coordinator token not provided'
      });
    });
};