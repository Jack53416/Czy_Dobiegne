import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import styles from '../../styles/login.scss';
import {Row, Col,} from 'react-bootstrap';
import axios from 'axios';

const myApi = axios.create({
  baseURL: 'https://35.165.124.185/api/',
  timeout: 10000,
  withCredentials: false,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      login: {
        username: "",
        password: ""
      },
      register: {
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      }
    };
  }

  validateLoginForm() {
    return this.state.login.username.length > 0 
    && this.state.login.password.length > 0;
  }

  validateRegisterForm() {
    return this.state.register.email.length > 0 
    && this.state.register.password.length > 0
    && this.state.register.username.length > 0
    && this.state.register.confirmPassword == this.state.register.password;
  }

  handleChange(event) {
    var ids = event.target.id;
    ids = ids.split('.');
    const item = this.state[ids[0]];
    item[ids[1]] = event.target.value;

    this.forceUpdate();
  }

  handleRegisterSubmit(event) {
    event.preventDefault();

    myApi.post('/user', {
      username: this.state.register.username,
      email: this.state.register.email,
      password: this.state.register.password
    })
    .then(function (response) {
      console.log(response);
      alert('!!!!!!! SUCCESS !!!!!!!')
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  handleLoginSubmit(event) {
    event.preventDefault();

    myApi.post('/auth', {
      username: this.state.login.username,
      password: this.state.login.password
    })
    .then(function (response) {
      console.log(response);
      alert('!!!!!!! ZALOGOWANO !!!!!!!')
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={6}>
              <div className="Login">
              <form onSubmit={this.handleLoginSubmit.bind(this)}>
                <h2>Login</h2>
                <FormGroup controlId="login.username" bsSize="large">
                  <ControlLabel>Username</ControlLabel>
                  <FormControl
                    type="text"
                    value={this.state.login.username}
                    onChange={this.handleChange.bind(this)}
                  />
                </FormGroup>
                <FormGroup controlId="login.password" bsSize="large">
                  <ControlLabel>Password</ControlLabel>
                  <FormControl
                    value={this.state.login.password}
                    onChange={this.handleChange.bind(this)}
                    type="password"
                  />
                </FormGroup>
                <Button
                  block
                  bsSize="large"
                  disabled={!this.validateLoginForm()}
                  type="submit">
                  Login
                </Button>
              </form>
            </div>
        </Col>
        <Col xs={6}>
            <div className="Login">
            <form onSubmit={this.handleRegisterSubmit.bind(this)}>
              <h2>Register</h2>
              <FormGroup controlId="register.username" bsSize="large">
                <ControlLabel>Username</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state.register.username}
                  onChange={this.handleChange.bind(this)}
                />
              </FormGroup>
              <FormGroup controlId="register.email" bsSize="large">
                <ControlLabel>Email</ControlLabel>
                <FormControl
                  type="email"
                  value={this.state.register.email}
                  onChange={this.handleChange.bind(this)}
                />
              </FormGroup>
              <FormGroup controlId="register.password" bsSize="large">
                <ControlLabel>Password</ControlLabel>
                <FormControl
                  value={this.state.register.password}
                  onChange={this.handleChange.bind(this)}
                  type="password"
                />
              </FormGroup>
              <FormGroup controlId="register.confirmPassword" bsSize="large">
                <ControlLabel>Confirm Password</ControlLabel>
                <FormControl
                  value={this.state.register.confirmPassword}
                  onChange={this.handleChange.bind(this)}
                  type="password"
                />
              </FormGroup>
              <Button
                block
                bsSize="large"
                disabled={!this.validateRegisterForm()}
                type="submit">
                Register
              </Button>
            </form>
          </div>
        </Col>
        </Row>
      </div>
    );
  }
}

export default Login;