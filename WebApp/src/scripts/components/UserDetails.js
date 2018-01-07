import React from 'react';
import BaseComponent from './base/BaseComponent';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Querystring from 'query-string';

const myApi = axios.create({
    baseURL: 'https://35.165.124.185/api/',
    timeout: 10000,
    withCredentials: false,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        'X-Auth-Token': BaseComponent.userToken
    }
});

class UserDetails extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    }

    handleSave(event) {
        event.preventDefault();

        var data = Querystring.stringify({ 
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
          });

        myApi.put('/user', data)
          .then(function (response) {
            console.log(response);
            alert('!!!!!!! SUCCESS !!!!!!!')
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    handleChange(event) {
        var id = event.target.id;
        this.state[id] = event.target.value;

        this.forceUpdate();
    }

    validateForm() {
        return this.state.email.length > 0
            && this.state.password.length > 0
            && this.state.username.length > 0
            && this.state.confirmPassword == this.state.password;
    }

    render() {
        return (
            <Row>
                <Col xs={12}>
                    <form onSubmit={this.handleSave.bind(this)}>
                        <h2>User Details</h2>
                        <FormGroup controlId="username" bsSize="large">
                            <ControlLabel>Username</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.username}
                                onChange={this.handleChange.bind(this)}
                            />
                        </FormGroup>
                        <FormGroup controlId="email" bsSize="large">
                            <ControlLabel>Email</ControlLabel>
                            <FormControl
                                type="email"
                                value={this.state.email}
                                onChange={this.handleChange.bind(this)}
                            />
                        </FormGroup>
                        <FormGroup controlId="password" bsSize="large">
                            <ControlLabel>New Password</ControlLabel>
                            <FormControl
                                value={this.state.password}
                                onChange={this.handleChange.bind(this)}
                                type="password"
                            />
                        </FormGroup>                        <FormGroup controlId="confirmPassword" bsSize="large">
                            <ControlLabel>Confirm Password</ControlLabel>
                            <FormControl
                                value={this.state.confirmPassword}
                                onChange={this.handleChange.bind(this)}
                                type="password"
                            />
                        </FormGroup>
                        <Button
                            block
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit">
                            Save
                        </Button>
                    </form>
                </Col>
            </Row>
        );
    }
}
export default UserDetails;