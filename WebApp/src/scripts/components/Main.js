import React from 'react';
import { Switch, Route } from 'react-router-dom'
import AppMap from './Map';
import Login from './Login';


class Main extends React.Component {
    render() {
        return (
            <main>
                <Switch>
                <Route exact path='/' component={AppMap}/>
                <Route path='/login' component={Login}/>
                <Route path='/register' component={Login}/>
                </Switch>
            </main>
        );
    }
}

export default Main;
