import React from 'react';
import Image from './image';
var createClass = require('create-react-class');

const Content = createClass({
  render(){
    return (
      <div className="containter fluid">
        <div className="col-12 text-center">
          Select and Drag an on Object
        </div>
          <Image />
      </div>
    );
  }
});

export default Content;