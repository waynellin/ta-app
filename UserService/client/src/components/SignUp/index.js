import React, {Component} from "react";
import {connect} from "react-redux";
import { Link, browserHistory } from 'react-router';
import {
    setUserType,
    userAccessKeyError,
    userAccessKeyValid,
    userAuthenticate,
    userEmailError,
    userEmailValid,
    userPasswordError,
    userPasswordValid
} from "../../actions/userActions";
import {Button, Col, Form, FormControl, Grid, Row, FormGroup, Radio} from "react-bootstrap";
import axios from "axios";

let studentUserClient = axios.create({
  baseURL: 'http://localhost:3002/students',
  timeout: 1000
});

let coordinatorUserClient = axios.create({
  baseURL: 'http://localhost:3002/ta-coordinators',
  timeout: 1000
});

@connect((store) => {
  console.log(store);
  return {
    user: store.user
  }
})
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.setType = this.setType.bind(this);
    this.validate = this.validate.bind(this);
    this.signUp = this.signUp.bind(this);
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
          this.passwordError = true;
      } else if (this.password.value !== this.confirmPassword.value) {
           this.setState({
              ...this.state,
              passwordError: 'Confirm Password does not match'
          });
          this.passwordError = true;
      } else {
           this.setState({
              ...this.state,
              passwordError: null
          });
          this.passwordError = false;
      }
      if (this.props.user.user.user_type === 'ta-coordinator') {
          if (!this.accessKey.value) {
            this.setState({
                ...this.state,
                accessKeyError: 'Invalid Account Key'
            });
            this.accessKeyError = true;
          } else {
              this.setState({
                ...this.state,
                accessKeyError: null
            });
            this.accessKeyError = false;
          }
      }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validatePassword(password) {
    var re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(password);
  }

  signUp(event) {
      event.preventDefault();
      this.validate();
    if (!this.emailError && !this.passwordError && !this.accessKeyError) {
      if (this.props.user.user.user_type === 'ta-coordinator') {
        this.props.dispatch(userAuthenticate(
            coordinatorUserClient.post('/sign-up', {
                email: this.email.value,
                password: this.password.value
            }, {
                headers: {
                    'x-coordinator-account-key': this.accessKey.value
                }
            })
        ));
      } else {
        this.props.dispatch(userAuthenticate(
            studentUserClient.post('/sign-up', {
                email: this.email.value,
                password: this.password.value
            })
        ));
      }

    }
  }

  render() {
    if (this.props.user.user.id) {
      browserHistory.push(
        this.props.user.user.user_type === 'student' ? '/app/profile' :
                                                       '/coord'
      );
    }

      let AccessKeyField;
      if (this.props.user.user.user_type === 'ta-coordinator') {
          AccessKeyField = (<div><Row>
                              <Col xs={12}>
                                  <h6> COORDINATOR ACCOUNT KEY</h6>
                              </Col>
                          </Row>
                          <Row>
                              <Col xs={12}>
                                  <FormControl type="text" placeholder="ACCOUNT KEY" inputRef={ref => {this.accessKey = ref;}}/>
                                  <div style={{color: 'red'}}>{this.state.accessKeyError}</div>
                              </Col>
                          </Row></div>)
      }
      let SignUpError;
      if (this.props.user.error) {
          SignUpError = <h2 style={{color: 'red'}}>{this.props.user.error}</h2>
      }

      return (
          <Grid style={{height: "100%", paddingTop: 96}} >
              <Row className="centered">
                  <Col xsOffset={2} xs={8}>
                      <h1>{this.props.user.user.user_type.toUpperCase()} Sign up</h1>
                      {SignUpError}
                  </Col>
              </Row>
              <Row style={{marginTop:64}}>
                  <Col xsOffset={3} xs={6}>
                      <Form horizontal className="card">
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
                                  <h6>PASSWORD</h6>
                              </Col>
                          </Row>
                          <Row>
                              <Col xs={12}>
                                <FormControl type="password" autoComplete="off"
                                                placeholder="Password" inputRef={ref => {this.password = ref;}}/>
                                <div style={{color: 'red'}}>{this.state.passwordError}</div>
                              </Col>
                          </Row>
                          <br />
                          <Row>
                              <Col xs={12}>
                                  <h6>CONFIRM PASSWORD</h6>
                              </Col>
                          </Row>
                          <Row>
                              <Col xs={12}>
                                <FormControl type="password" autoComplete="off"
                                                placeholder="Confirm Password" inputRef={ref => {this.confirmPassword = ref;}}/>
                                <div style={{color: 'red'}}>{this.state.passwordError}</div>
                              </Col>
                          </Row>
                          <br />
                          {AccessKeyField}
                          <br />
                          <Row>
                              <Col xs={12}>
                                  <Button block bsStyle="primary"
                                          bsSize="large" onClick={this.signUp}>Creat an
                                      Account</Button>
                              </Col>
                          </Row>
                          <br/>
                          <Row>
                              <Col xs={12}>
                                  <Link className="see-more centered" to="/"><h5>Sign In</h5></Link>
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

export default SignUp;
