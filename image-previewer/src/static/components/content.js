import React, {Component} from 'react';
import Image from './image';

class Content extends Component{
  render(){
    return (
          <div className="row">
            <Image />
            <Image />
          </div>
    );
  }
}

export default Content;