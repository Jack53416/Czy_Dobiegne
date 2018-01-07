import React from "react";
import BaseComponent from './base/BaseComponent';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import styles from '../../styles/login.scss';
import {Row, Col,} from 'react-bootstrap';
import axios from 'axios';
import Querystring from 'query-string';
import { Redirect } from 'react-router-dom';

class Login extends BaseComponent {
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

    var data = Querystring.stringify({ 
      "username": this.state.register.username,
      "password": this.state.register.password,
      "email": this.state.register.email
    });

    BaseComponent.LoginApi.post('/user', data)
    .then(function (response) {
      console.log(response);
      alert('!!!!!!! SUCCESS !!!!!!!')
    })
    .catch(function (error) {
      alert(error);
    });
  }

  handleLoginSubmit(event) {
    event.preventDefault();
    var data = Querystring.stringify({ 
      username: this.state.login.username,
      password: this.state.login.password
    });

    BaseComponent.LoginApi.post('/auth',data)
    .then(res => {
      console.log(res);
      BaseComponent.logIn(res.data.token);
      window.location.reload();
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