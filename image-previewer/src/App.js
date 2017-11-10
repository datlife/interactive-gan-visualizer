import React, {Component} from 'react';
import Header   from './components/header';
import Uploader from './components/uploader';
import Content  from './components/main';
import Footer   from './components/footer';

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