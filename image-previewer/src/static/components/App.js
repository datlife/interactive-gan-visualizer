import React, {Component} from 'react';

import Header from './header';
import Content from './content';
import Footer from './footer';
import Uploader from './uploader';

let example = require("../../assets/cute-cat.jpg");

class App extends Component{
    constructor(props){
        super(props);
        this.state ={
            images: []
        }
    }
    render(){
        return(
            <div className="main-app container-fluid"> 
                <Header />
                <Uploader onLoad={images => this.setState({images})}/>
                <Content  images={this.state.images} />
                <Footer />
            </div>
        )
    }
}

export default App;