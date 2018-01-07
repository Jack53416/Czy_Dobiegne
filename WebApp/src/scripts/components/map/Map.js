import React from 'react';
import BaseComponent from '../BaseComponent';
import axios from 'axios';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer, Circle } from 'react-leaflet';


const position = [51.75, 19.46];



class AppMap extends BaseComponent {
    constructor(props) {
        super(props);
        this.items = props.items;
        this.state = { locations: [], userLocation: position };
        this.getLocations();
        this.centerMap = this.centerMap.bind(this);
        this.getUserLocation();
    }

    getLocations() {
        BaseComponent.Api.get(`/locations/Łódź?fields=*`)
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
