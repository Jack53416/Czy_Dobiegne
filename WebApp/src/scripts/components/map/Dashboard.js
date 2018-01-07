import React from 'react';
import BaseComponent from '../base/BaseComponent';
import { Row, Col } from 'react-bootstrap';
import Map from './Map';
import Filter from './Filter';


class Dashboard extends BaseComponent {
    constructor(props){
        super(props);

        this.state = { locations: [] };
        this.handleFilterCallback = this.handleFilter.bind(this);
    }

    getLocations() {
        BaseComponent.Api.get(`/locations/Łódź?fields=*`)
            .then(res => {
                this.setState({
                    locations: res.data.data
                });
            });
    }

    handleFilter(filterProps){
        var querypath = `/locations/${filterProps.city}?fields=*&street=${filterProps.street}&price_min=${filterProps.priceMin}&price_max=${filterProps.priceMax}`;
        BaseComponent.Api.get(querypath)
        .then(res => {
            this.setState({
                locations: res.data.data
            });
        });
        
    }

    render() {
        return (
            <Row className="dashboard">
                <Col xs={4}>
                    <Filter filterCallback={this.handleFilterCallback} />
                </Col>
                <Col xs={8}>
                    <Map locations={this.state.locations}/>
                </Col>
            </Row>
        );
    }
}

export default Dashboard;
