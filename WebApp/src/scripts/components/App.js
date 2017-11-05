import React from 'react';
import Header from './Header';
import Menu from './Menu';
import AppMap from './Map';
import {Grid, Row, Col, Clearfix} from 'react-bootstrap';

class App extends React.Component {
    render() {
        return (
            <div className="container-fluid no-padding">
                <Row className="no-padding">
                    <Col xs={12} className="no-padding">
                        <Menu />
                    </Col>
                </Row>
                <Row className="no-padding">
                    <Col xs={12} className="no-padding">
                        <AppMap />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default App;