import React from 'react';
import { Switch, Route } from 'react-router-dom'
import AppMap from './map/Dashboard';
import Login from './Login';
import UserDetails from './UserDetails';
import LocationList from './location/LocationList';
import LocationAdd from './location/LocationAdd';


class Main extends React.Component {
    render() {
        return (
            <main>
                <Switch>
                    <Route exact path='/' component={AppMap} />
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Login} />
                    <Route path='/user' component={UserDetails} />
                    <Route path='/location' component={LocationList}/>
                    <Route exact path='/locationAdd' component={LocationAdd} />
                </Switch>
            </main>
        );
    }
}

export default Main;
