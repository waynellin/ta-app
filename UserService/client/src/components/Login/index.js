import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Button, Col, Form, FormControl, Grid, Jumbotron, Row, FormGroup, Radio} from "react-bootstrap";
import { 
  setUserType, 
  userEmailError, 
  userPasswordError,
  userEmailValid,
  userPasswordValid,
  userAuthenticate
} from '../../actions/userActions';
import { Link } from 'react-router';
import axios from 'axios';
import { browserHistory } from 'react-router';

let studentUserClient = axios.create({
  baseURL: 'http://localhost:3002/students',
  timeout: 1000
});

let coordinatorUserClient = axios.create({
  baseURL: 'http://localhost:3002/ta-coordinators',
  timeout: 1000
});

@connect((store) => {
  return {
    user: store.user
  }
})
class Login extends Component {
  constructor(props) {
    super(props);
    this.setType = this.setType.bind(this);
    this.validate = this.validate.bind(this);
    this.login = this.login.bind(this);
    this.state = {};
  }

  componentWillMount() {
    this.props.dispatch(setUserType('student'));
  }

  setType(event) {
    this.props.dispatch(setUserType(event.target.value));
  }

  validate() {
    if (!this.validateEmail(this.email.value)) {
      this.setState({
        ...this.state,
        emailError: 'Invalid Email Address'
      });
      this.emailError = true;
    } else {
      this.setState({
        ...this.state,
        emailError: null
      });
      this.emailError = false;
    }
    if (!this.validatePassword(this.password.value)) {
      this.setState({
        ...this.state,
        passwordError: 'Invalid Password'
      });
      this.passworError = true;
    } else {
      this.setState({
        ...this.state,
        passwordError: null
      });
      this.passwordError = false;
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validatePassword(password) {
    return Boolean(password.length);
  }

  login(event) {
    event.preventDefault();
    this.validate();

    if (!this.emailError && !this.passwordError) {
      if (this.props.user.user.user_type === 'ta-coordinator') {
        this.props.dispatch(userAuthenticate(
          coordinatorUserClient.post('/authenticate', {
            email: this.email.value,
            password: this.password.value
          })
        ));
      } else {
        this.props.dispatch(userAuthenticate(
          studentUserClient.post('/authenticate', {
            email: this.email.value,
            password: this.password.value
          })
        ));
      }
    }
  }

  render() {

    if (this.props.user.authenticated){
      if(this.props.user.user.user_type === "student"){
          browserHistory.push("/app/jobs")
      }else if (this.props.user.user.user_type === "ta-coordinator") {
          browserHistory.push("/coord")
      }
    }

    let SuccessLabel;
    if (this.props.user.status === 200) {
      let successStyle = {
        color: '#228B22'
      }
      SuccessLabel = <h3 style={successStyle}>{'Welcome ' + this.props.user.user.email}</h3>
    }

    let ErrorLabel;
    if (this.props.user.error) {
      let errorStyles = {
        color: '#FF0000'
      }
      ErrorLabel = <h3 style={errorStyles}>{this.props.user.error}</h3>
    }

    if (this.props.user.authenticating) {
      return (

        <h1>AUTHENTICATING</h1>
      );
    }

    let loginTitle = <div><h1 style={{marginBottom: 16, marginTop: 64}}>Apply to be a TA</h1>
                      <h2 style={{marginBottom: 48}}>Log in to see your application portal.</h2></div>;
    if (this.props.user.user.user_type === 'ta-coordinator') {
      loginTitle = <div><h1 style={{marginBottom: 16, marginTop: 64}}>Manage TA posisition assignments</h1>
                      <h2 style={{marginBottom: 48}}>Log in to see your position assignment portal.</h2></div>;
    }
        
      const jumboStyle = {
          height: "100%",
          background: "none"
      };
      return (
          <Grid fluid style={{height: "100%"}}>
              <Row style={{padding:"64px"}}>
                  <Col xs={12} sm={6} smOffset={1}>
                      <Jumbotron style={jumboStyle}>
                          {loginTitle}
                          {SuccessLabel}
                          {ErrorLabel}
                      </Jumbotron>
                  </Col>
                  <Col xs={12} sm={4}>
                       <Form horizontal className="card" >
                          <Row>
                              <Col xs={12} style={{marginBottom:24}}>
                                  <h2 style={{teaxtAlign:"center", margin:0}}> Sign In</h2>
                              </Col>
                          </Row>
                          <Row>
                              <Col xs={12}>
                                  <FormGroup>
                                      <Radio value="student" checked={this.props.user.user.user_type === 'student'} onChange={this.setType}>Student</Radio>
                                      <Radio value="ta-coordinator" checked={this.props.user.user.user_type === 'ta-coordinator'} onChange={this.setType}>Coordinator</Radio>
                                  </FormGroup>
                              </Col>
                          </Row>
                          <br />
                          <Row>
                              <Col xs={12}>
                                  <h6> EMAIL</h6>
                              </Col>
                          </Row>
                          <Row>
                              <Col xs={12}>
                                  <FormControl type="text" placeholder="Email" inputRef={ref => {this.email = ref;}}/>
                                  <div style={{color: 'red'}}>{this.state.emailError}</div>
                              </Col>
                          </Row>
                          <br />
                          <Row>
                              <Col xs={12}>
                                  <h6> PASSWORD</h6>
                              </Col>
                          </Row>
                          <Row>
                              <Col xs={12}>
                                  <FormControl type="password" placeholder="Password" inputRef={ref => {this.password = ref;}}/>
                                  <div style={{color: 'red'}}>{this.state.passwordError}</div>
                              </Col>
                          </Row>
                          <br />
                          <Row>
                              <Col xs={12}>
                                  <Button block  bsStyle="primary"
                                          bsSize="large" onClick={this.login}>Sign In</Button>
                              </Col>
                          </Row>
                          <br/>
                          <Row>
                              <Col xs={12}>
                                  <Link className="see-more centered" to="/sign-up"><h5>Create an Account</h5></Link>
                              </Col>
                          </Row>
                      </Form>
                  </Col>
              </Row>

              {this.props.children}
          </Grid>
      );
  }
}

export default Login;
