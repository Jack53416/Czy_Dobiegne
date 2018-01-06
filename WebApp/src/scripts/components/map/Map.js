import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer, Circle } from 'react-leaflet';
import axios from 'axios';


const position = [51.75, 19.46];

const api = {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, x-client-token',
        'x-client-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOi0xLCJwZXJtaXNzaW9ucyI6ImFwaUNsaWVudCIsImlhdCI6MTUxMzQyMzIwNn0.ZMyiLAPQkRDzEJKh8iOKpP0slvvyL8rw5ZcEVBwFMUk'
    },
    mode: 'cors',
    cache: 'default'
};

const myApi = axios.create({
    baseURL: 'https://35.165.124.185/api',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        'x-client-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOi0xLCJwZXJtaXNzaW9ucyI6ImFwaUNsaWVudCIsImlhdCI6MTUxMzQyMzIwNn0.ZMyiLAPQkRDzEJKh8iOKpP0slvvyL8rw5ZcEVBwFMUk'
    }
});

class AppMap extends React.Component {
    constructor(props) {
        super(props);
        this.items = props.items;
        this.state = { locations: [], userLocation: position };
        this.getLocations();
        this.centerMap = this.centerMap.bind(this);
        this.getUserLocation();

    }

    getLocations() {
        myApi.get(`/locations/Łódź?fields=*`)
            .then(res => {
                this.setState({
                    locations: res.data.data
                });
            });
    }

    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.centerMap);
        } else {
            // geolocation not supported. TODO: Handle it
        }
    }

    centerMap(position) {
        this.setState({
            userLocation: [position.coords.latitude, position.coords.longitude]
        });
    }

    render() {
        return (
            <Map center={this.state.userLocation} zoom={12} style={{ height: 500 }} className="map">
                <TileLayer
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                {this.state.locations.map(function (x, i) {
                    return (
                        <Marker key={i} position={[x.latitude, x.longitude]}>
                            <Popup>
                                <span>{x.description}</span>
                            </Popup>
                        </Marker>
                    )
                }
                )}
                <Circle center={this.state.userLocation} radius={100} color="blue" fillColor="blue">
                    <Popup>
                        <span>
                            Twoja lokalizacja
                    </span>
                    </Popup>
                </Circle>
            </Map>
        );
    }
}

export default AppMap;
