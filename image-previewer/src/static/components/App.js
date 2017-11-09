import React, {Component} from 'react';

import Header from './header';
import Uploader from './uploader';
import Content from './content';
import Footer from './footer';


class App extends Component{
    constructor(props){
        super(props);
        this.state ={
            images: []
        }
    }
    render(){
        return(
            <div className="main-app container"> 
                <Header />
                <Uploader onLoad={images => this.setState({images})}/>
                <Content  images={this.state.images} />
                <Footer />
            </div>
        )
    }
}

export default App;