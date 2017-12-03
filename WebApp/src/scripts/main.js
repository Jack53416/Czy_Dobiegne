import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import 'bootstrap-sass';

import Styles from "../styles/main.scss";
import App from "./components/App";

ReactDOM.render(
    <BrowserRouter>
        {<App />}
    </BrowserRouter>,
    document.getElementById('container')
);