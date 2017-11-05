import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';


const position = [51.75, 19.46];

class AppMap extends React.Component {
    constructor(props) {
        super(props);
        this.items = props.items;
    }

    render() {
        return ( 
            <Map center={position} zoom={12} style={{ height: 500 }}>
                <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                <Marker position={position}>
                <Popup>
                    <span>Łódź</span>
                </Popup>
                </Marker>
            </Map>
        );
    }
}

export default AppMap;
