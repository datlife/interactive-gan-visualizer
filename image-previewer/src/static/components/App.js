import React, {Component} from 'react';
import Header   from './header';
import Uploader from './uploader';
import Content  from './content';
import Footer   from './footer';

class App extends Component{
    render(){
        return(
            <div className="main-app container-fluid"> 
                <Header />
                <Uploader />
                <Content  />
                <Footer   />
            </div>
        )
    }
}
export default App;