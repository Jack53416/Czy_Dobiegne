import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
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
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, X-Client-Token',
        'x-client-token': '' //TODO: Request does not have this header. FIX
    }
});

class LocationList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            locations: []
        }

        this.getLocations();
    }

    getLocations() {
        myApi.get('/locations/Łódź?fields=*')
            .then(function (response) {
                this.state.locations = response.data;
                console.log(this.state.locations);
                this.forceUpdate();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <BootstrapTable data={this.state.locations} striped={true} hover={true}>
                <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>Product ID</TableHeaderColumn>
                <TableHeaderColumn dataField="name" dataSort={true}>Nazwa</TableHeaderColumn>
                <TableHeaderColumn dataField="city" >Miasto</TableHeaderColumn>
            </BootstrapTable>
        );
    }
}

export default LocationList;