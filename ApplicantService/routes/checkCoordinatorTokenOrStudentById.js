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
          if (req.params.id || req.query.user_id || req.body.user_id) {
            data = JSON.parse(data);
            if(!(data.decodedToken.user_id === req.params.id ||
              data.decodedToken.user_id === req.query.student_id ||
              data.decodedToken.user_id === req.body.user_id)) {
              res.status(401).json({
                message: 'Invalid Token: This token does not belong to you.'
              });
            } else {
              next();
            }
          } else {
            res.status(401).json({
              message: 'Invalid Token: This endpoint is not accessible by you.'
            });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(401).json({
            message: 'Authentication Failed: Invalid token provided'
          });
        });
    })
};