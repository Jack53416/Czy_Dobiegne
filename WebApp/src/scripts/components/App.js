import React from 'react';
import Header from './Header';
import Menu from './Menu';
import Main from './Main';
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
                <Row className="no-padding maincontent">
                    <Col xs={12} className="no-padding">
                        <Main />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default App;