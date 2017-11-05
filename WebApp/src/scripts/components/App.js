import React from 'react';
import Header from './Header';
import Menu from './Menu';

class App extends React.Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <Menu />
                    <div className="col-xs-12">
                    
                    </div>
                </div>
            </div>
        );
    }
}

export default App;