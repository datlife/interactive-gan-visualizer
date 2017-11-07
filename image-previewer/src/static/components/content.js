import React, {Component} from 'react';
import Image from './image';
import Buttons from './buttons';

let example = require("../../assets/cute-cat.jpg");


class Content extends Component{
  render(){
    return (
      <div className="body container-fluid">
          <div className="d-flex">
            <Image   id="original-img"  src={example} caption={"Original Image"} className="flex-row" />  {/* Display Image  */}
            <Buttons id="controllers"/>
            <Image   id="generated-img" src={example} caption={"Generated Image"}  className="flex-row" />  {/* Display Image  */}
          </div>

      </div>
    );
  }
}

export default Content;
