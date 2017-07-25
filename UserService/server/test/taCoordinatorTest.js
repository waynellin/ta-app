/**
 * Created by TenzinLama on 2017-03-7.
 */

let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let User = require('../models/User');
let keygenerator = require('keygenerator');
let uuid = require('uuid/v4');
let CoordinatorAccessKey = require('../models/CoordinatorAccessKey');
let app = require('../app');
chai.use(chaiHttp);

let token;
let user_email;
let x_coordinator_account_key;
describe('taCoordinator', function () {
    this.timeout(0);

    beforeEach(function (done) {
      let accessKey = new CoordinatorAccessKey({
          id: uuid(),
          key: keygenerator._()
      });
      //create coordinator access key
      accessKey.save((err) => {
          if (err) throw err;
          x_coordinator_account_key = accessKey.key;
          User.remove({}, function (err) {
            if (err) throw err;

            chai.request(app)
                .post('/ta-coordinators/sign-up')
                .set('x-coordinator-account-key', x_coordinator_account_key)
                .send({
                    email:'test',
                    id: 'test',
                    password: 'test',
                    user_type: 'ta-coordinator'
                })
                .end(function (err, res) {
                    expect(res).to.have.status(201);
                    token = res.body.user.user_token;
                    user_email = res.body.user.email;
                    done();
                  });
              });
         });
    });

    it('should return 401 if signing up with invalid coordinator account key', function(done){
      chai.request(app)
      .post('/ta-coordinators/sign-up')
      .set('x-coordinator-account-key', 'test')
      .send({
        email:'test1',
        id: 'test',
        password: 'test',
        user_type: 'ta-coordinator'
      })
      .end(function(err, res){
        expect(res).to.have.status(401);
        done();
      });
    });

    it('should return 409 if signing up with existing user', function(done){
      chai.request(app)
      .post('/ta-coordinators/sign-up')
      .set('x-coordinator-account-key','test')
      .send({
        email:'test',
        id: 'test',
        password:'test',
      })
      .end(function(err,res){
        expect(res).to.have.status(409);
        done();
      });
    });

    it('should return successfull authentication', function(done){
      chai.request(app)
      .post('/ta-coordinators/authenticate')
      .set('x-access-token', token)
      .send({
          email: user_email,
          password: 'test',

      })
      .end(function(err, res){
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
      });
    });

    it('should successfully verify token', function(done){
      chai.request(app)
      .post('/ta-coordinators/check-token')
      .set('x-access-token', token)
      .end(function(err,res){
        expect(res).to.have.status(200);
        done();
      });
    });

    it('should return 401 with wrong password', function(done){
      chai.request(app)
      .post('/ta-coordinators/authenticate')
      .set('x-access-token',token)
      .send({
        email: user_email,
        password: 'test2'
      })
      .end(function(err,res){
        expect(res).to.have.status(401);
        done();
      });
    });

    it('should return 404 with non-existing email', function(done){
      chai.request(app)
      .post('/ta-coordinators/authenticate')
      .set('x-access-token',token)
      .send({
        email: 'wrong-email',
        password: 'random-pass'
      })
      .end(function(err,res){
        expect(res).to.have.status(404);
        done();
      });
    });

  });
