import React, {Component} from 'react';
import Header from './header';
import Content from './content';
import Footer from './footer';

class App extends Component{
    render(){
        return(
            <div className="main-app"> 
                <Header />
                <Content />
                <Footer />
            </div>


        )
    }
}

export default App;