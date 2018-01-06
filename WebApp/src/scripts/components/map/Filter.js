import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';

class MapFilter extends React.Component {

    constructor(props) {
        super(props);

        //this.state = {
        //    username: "",
        //    email: "",
        //    password: "",
        //    confirmPassword: ""
        }
    }

    filter(event) {
        //event.preventDefault();

        //myApi.put('/user', {
        //    username: this.state.username,
        //    email: this.state.email,
        //    password: this.state.password
        //})
        //    .then(function (response) {
        //        console.log(response);
        //        alert('!!!!!!! SUCCESS !!!!!!!')
        //    })
        //    .catch(function (error) {
        //        console.log(error);
        //    });
    }

    render() {
        return (
            <Row>
                <Col xs={12}>
                    <form onSubmit={this.filter.bind(this)}>
                        <h2>Filtry</h2>
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
                            Register
                        </Button>
                    </form>
                </Col>
            </Row>
        );
    }
}
export default MapFilter;