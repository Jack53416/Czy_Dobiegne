import React from 'react';
import Constants from '../../utils/constants'
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://35.165.124.185/api',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, x-client-token',
        'x-client-token': Constants.ClientToken
    }
});

const loginApi = axios.create({
    baseURL: 'https://35.165.124.185/api',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
    }
});

let isLoggedIn = sessionStorage.getItem('IsLoggedIn');
let userToken = sessionStorage.getItem('UserToken');

class BaseComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    static get Api() {
        return api;
    }

    static get LoginApi() {
        return loginApi;
    }

    static get isLoggedIn() {
        return sessionStorage.getItem('IsLoggedIn');
    }

    static logIn(token) {
        sessionStorage.setItem('IsLoggedIn', true)
        sessionStorage.setItem('UserToken', token)
    }

    static get userToken() {
        return sessionStorage.getItem('UserToken')
    }

    static logOut() {
        sessionStorage.setItem('IsLoggedIn', false)
    }
}

export default BaseComponent;