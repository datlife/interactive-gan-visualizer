import React, {Component} from 'react';
import Header from './header';
import Content from './content';
// import Footer from './footer';

// styling
import '../styles/main.css';

class App extends Component{
    constructor(){
        super();
    }
    
    render(){
        return(
            <div className="container-fluid app">   
                <Header />
                <Content />
            </div>
        )
    }
}

export default App;