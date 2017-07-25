let rp = require('request-promise');

module.exports = (req, res, next) => {
  let coordinatorsUri = 'http://localhost:3002/ta-coordinators/check-token';
  let studentsUri = 'http://localhost:3002/students/check-token';
  let args = {
    method: 'POST',
    uri: coordinatorsUri,
    headers: {
      'x-access-token': req.body.token || req.query.token || req.headers['x-access-token']
    }
  }
  rp(args)
    .then((data) => {
      next();
    })
    .catch((err) => {
      args.uri = studentsUri;
      rp(args)
        .then((data) => {
          next();
        })
        .catch((err) => {
          res.status(401).json({
            message: 'Authentication Failed: Token not provided'
          });
        });
    });
};