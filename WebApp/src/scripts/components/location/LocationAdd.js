import React from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';

const myApi = axios.create({
    baseURL: 'https://35.165.124.185/api',
    timeout: 10000,
    withCredentials: false,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, X-Client-Token'
    }
});


class LocationAdd extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            country: "",
            city: "",
            street: "",
            longitude: "",
            latitude: "",
            priceMin: "",
            priceMax: "",
            description: ""
        }
    }

    handleSave(event) {
        event.preventDefault();

        myApi.post('/location', {
            name: this.state.name,
            country: this.state.country,
            city: this.state.city,
            street: this.state.street,
            longitude: this.state.longitude,
            latitude: this.state.latitude,
            priceMin: this.state.priceMin,
            priceMax: this.state.priceMax,
            description: this.state.description
        })
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
        return this.state.name.length > 0
            && this.state.country.length > 0
            && this.state.city.length > 0
            && this.state.street.length > 0
            && this.state.longitude.length > 0
            && this.state.latitude.length > 0
    }

    render() {
        return (
            <Row>
                <form onSubmit={this.handleSave.bind(this)}>
                    <h2>Dodaj lokalizacje</h2>
                    <Col xs={6}>
                        <FormGroup controlId="name" bsSize="large">
                            <ControlLabel>Name</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.name}
                                onChange={this.handleChange.bind(this)}
                            />
                        </FormGroup>
                        <FormGroup controlId="country" bsSize="large">
                            <ControlLabel>Country</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.country}
                                onChange={this.handleChange.bind(this)}
                            />
                        </FormGroup>
                        <FormGroup controlId="city" bsSize="large">
                            <ControlLabel>City</ControlLabel>
                            <FormControl
                                value={this.state.city}
                                onChange={this.handleChange.bind(this)}
                                type="text"
                            />
                        </FormGroup>
                        <FormGroup controlId="street" bsSize="large">
                            <ControlLabel>Street</ControlLabel>
                            <FormControl
                                value={this.state.street}
                                onChange={this.handleChange.bind(this)}
                                type="text"
                            />
                        </FormGroup>
                        <FormGroup controlId="description" bsSize="large">
                            <ControlLabel>Description</ControlLabel>
                            <FormControl
                                value={this.state.description}
                                onChange={this.handleChange.bind(this)}
                                type="text"
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={6}>
                        <FormGroup controlId="longitude" bsSize="large">
                            <ControlLabel>Longitude</ControlLabel>
                            <FormControl
                                value={this.state.longitude}
                                onChange={this.handleChange.bind(this)}
                                type="text"
                            />
                        </FormGroup>
                        <FormGroup controlId="latitude" bsSize="large">
                            <ControlLabel>Latitude</ControlLabel>
                            <FormControl
                                value={this.state.Latitude}
                                onChange={this.handleChange.bind(this)}
                                type="text"
                            />
                        </FormGroup>
                        <FormGroup controlId="priceMin" bsSize="large">
                            <ControlLabel>Price Min</ControlLabel>
                            <FormControl
                                value={this.state.priceMin}
                                onChange={this.handleChange.bind(this)}
                                type="text"
                            />
                        </FormGroup>
                        <FormGroup controlId="priceMax" bsSize="large">
                            <ControlLabel>Price Max</ControlLabel>
                            <FormControl
                                value={this.state.priceMax}
                                onChange={this.handleChange.bind(this)}
                                type="text"
                            />
                        </FormGroup>
                    </Col>
                    <Col xs={12}>
                        <Button
                            block
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit">
                            Dodaj
                    </Button>
                    </Col>
                </form>
            </Row>
        );
    }
}

export default LocationAdd;