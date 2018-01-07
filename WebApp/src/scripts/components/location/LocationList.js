import React from 'react';
import BaseComponent from '../base/BaseComponent';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';

class LocationList extends BaseComponent {

    constructor(props) {
        super(props);

        this.state = {
            locations: []
        }

        this.getLocations();
    }

    getLocations() {
        BaseComponent.Api.get('/locations/Łódź?fields=*')
            .then(res => {
                this.setState({
                    locations: res.data.data
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <BootstrapTable data={this.state.locations} striped={true} hover={true}>
                <TableHeaderColumn dataField="id" isKey={true} hidden={true} dataAlign="center" dataSort={true}>Product ID</TableHeaderColumn>
                <TableHeaderColumn dataField="name" dataSort={true}>Nazwa</TableHeaderColumn>
                <TableHeaderColumn dataField="city" >Miasto</TableHeaderColumn>
                <TableHeaderColumn dataField="street" >Ulica</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

export default LocationList;