import React from 'react';
import BaseComponent from '../BaseComponent';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';

class MapFilter extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            city: "Łódź",
            street: "",
            priceMin: "",
            priceMax: "",
            rating: "1"
        }
    }

    handleChange(event) {
        var id = event.target.id;
        this.state[id] = event.target.value;

        this.forceUpdate();
      }

    filter(event) {
        this.props.filterCallback(this.state);
    }

    render() {
        return (
            <Row>
                <Col xs={12}>
                    <form onSubmit={this.filter.bind(this)}>
                        <h2>Filtry</h2>
                        <FormGroup controlId="city" bsSize="large">
                            <ControlLabel>Miasto</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.city}
                                onChange={this.handleChange.bind(this)}
                            />
                        </FormGroup>
                        <FormGroup controlId="street" bsSize="large">
                            <ControlLabel>Ulica</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.street}
                                onChange={this.handleChange.bind(this)}
                            />
                        </FormGroup>
                        <FormGroup controlId="priceMin" bsSize="large">
                            <ControlLabel>Cena minimalna</ControlLabel>
                            <FormControl
                                type="number"
                                value={this.state.priceMin}
                                onChange={this.handleChange.bind(this)}
                            />
                        </FormGroup>
                        <FormGroup controlId="priceMax" bsSize="large">
                            <ControlLabel>Cena maksymalna</ControlLabel>
                            <FormControl
                                type="number"
                                value={this.state.priceMax}
                                onChange={this.handleChange.bind(this)}
                            />
                        </FormGroup>
                        <FormGroup controlId="rating" bsSize="large">
                            <ControlLabel>Ocena</ControlLabel>
                            <FormControl
                                ref={select => { this.state.rating = select}}
                                componentClass="select"
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </FormControl>
                        </FormGroup>
                        <Button
                            block
                            bsSize="large"
                            onClick={this.filter.bind(this)}
                            >
                            Filtruj
                        </Button>
                    </form>
                </Col>
            </Row>
        );
    }
}
export default MapFilter;