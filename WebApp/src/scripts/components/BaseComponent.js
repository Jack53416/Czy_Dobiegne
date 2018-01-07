import React from 'react';
import Constants from '../utils/constants'
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://35.165.124.185/api',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        'x-client-token': Constants.ClientToken
    }
});

class BaseComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    static get Api() {
        return api;
    }
}

export default BaseComponent;