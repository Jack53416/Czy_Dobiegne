import React from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import axios from 'axios';


const position = [51.75, 19.46];

const myApi = axios.create({
    baseURL: 'https://35.165.124.185/',
    timeout: 10000,
    withCredentials: false,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token'
    }
  });

class AppMap extends React.Component {
    constructor(props) {
        super(props);
        this.items = props.items;
        this.state = {locations: [], userLocation: position};
        this.getLocations();
        this.centerMap = this.centerMap.bind(this);
        this.getUserLocation();
       
    }

    getLocations(){
        myApi.get(`/test`)
        .then(res => {
          console.log(res.data);
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
            <Map center={this.state.userLocation} zoom={12} style={{ height: 500 }}>
                <TileLayer
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
                {this.state.locations.map(function(x, i)
                    {
                        return (
                            <Marker key={i} position={[x.latitude,x.longitude]}>
                            <Popup>
                                <span>{x.description}</span>
                            </Popup>
                            </Marker>
                        )
                    }
                )}
            </Map>
        );
    }
}

export default AppMap;
