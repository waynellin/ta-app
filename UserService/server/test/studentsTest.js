/**
 * Created by TenzinLama on 2017-03-7.
 */

let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let User = require('../models/User');
let app = require('../app');

chai.use(chaiHttp);

let token;
let user_email;
let id;

describe('students', function(){
  this.timeout(0);

  before(function(done){
    chai.request(app)
    .post('/students/sign-up')
    .send({
      email: 'studenttest',
      password: 'test'
    })
    .end(function (err, res) {
      expect(res).to.have.status(201);
      token = res.body.user.user_token;
      user_email = res.body.user.email;
      id = res.body.user.id;
      done();
    });
  });

  it('should return 404 with non-existing email', function(done){
    chai.request(app)
    .post('/students/authenticate')
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

  it('should return 401 with wrong password', function(done){
    chai.request(app)
    .post('/students/authenticate')
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

  it('should return successfull authentication', function(done){
    chai.request(app)
    .post('/students/authenticate')
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

  it('should return 409 if signing up with existing user', function(done){
    chai.request(app)
    .post('/students/sign-up')
    .set('x-coordinator-account-key','test')
    .send({
      email: user_email,
      id: 'test',
      password:'test',
    })
    .end(function(err,res){
      expect(res).to.have.status(409);
      done();
    });
  });

  it('should successfully verify token', function(done){
    chai.request(app)
    .post('/students/check-token')
    .set('x-access-token', token)
    .end(function(err,res){
      expect(res).to.have.status(200);
      done();
    });
  });

  it('should return 200 if student found by id', function(done){
    chai.request(app)
    .get('/students/' + id)
    .set('x-access-token', token)
    .end(function(err,res){
      expect(res).to.have.status(200);
      done();
    });
  });

  it('should return 404 if student not found by id', function(done){
    chai.request(app)
    .post('/students/' + 'wrong-id')
    .set('x-access-token', token)
    .end(function(err,res){
      expect(res).to.have.status(404);
      done();
    })
  })

});
