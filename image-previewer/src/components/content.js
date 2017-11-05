import React from 'react';
import Image from './image';
var createClass = require('create-react-class');

const Content = createClass({
  render(){
    return (
        <div className="jumbotron">
          <p className="lead text-center">Select and Drag an on Object</p>
          <div className="row">
            <Image />
            <Image />
          </div>
        </div>
    );
  }
});

export default Content;