import React from 'react';
import Header from './header';
// import Footer from './footer';
// import Content from './content';
var createClass = require('create-react-class');

const App = createClass({
    render(){
        return(
            <div className="app">   
                <Header />
            </div>
        )
    }
});

export default App;