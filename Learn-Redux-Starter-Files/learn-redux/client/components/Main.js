import React from 'react';
import {Link} from 'react-router';
import Uploader from './Uploader';

const Main = React.createClass({
    render(){
        return(
            <div>
                <div className="container">
                    <Uploader />
                </div>
                <h1>HelloWorld</h1>
            </div>
        )
    }
});

export default Main;