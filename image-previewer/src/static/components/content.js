import React, {Component} from 'react';
import Image from './image';
import Uploader from './uploader';

class Content extends Component{
  render(){
    return (
      <div className="body container">
          {/* Upload Image  */}
          <Uploader />

          {/* Display Image  */}
          <Image />
      </div>
    );
  }
}

export default Content;