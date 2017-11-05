import React from 'react';
import Header from './header';
// import Footer from './footer';
import Content from './content';
import '../styles/main.css';
var createClass = require('create-react-class');

const App = createClass({
    render(){
        return(
            <div className="container-fluid app">   
                <Header />
                <Content />
            </div>
        )
    }
});

export default App;