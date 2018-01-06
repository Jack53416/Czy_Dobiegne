import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Map from './Map';
import Filter from './Filter';


class Dashboard extends React.Component {
    render() {
        return (
            <Row className="dashboard">
                <Col xs={4}>
                    <Filter />
                </Col>
                <Col xs={8}>
                    <Map />
                </Col>
            </Row>
        );
    }
}

export default Dashboard;
