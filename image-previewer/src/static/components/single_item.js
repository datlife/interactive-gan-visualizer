import React from 'react';
import Image from './image';
import Buttons from './buttons';

class SingleView extends React.Component{
    render(){
        return(
            <li className="list-group-item">
                <div className="d-flex align-items-start">
                    <Image   id="original-img"   img={this.props.img} caption={"Original Image"} className="flex-row" /> 
                    <Buttons id="controllers"/>
                    <Image   id="generated-img"  img={this.props.img} caption={"Generated Image"}  className="flex-row" />
                </div>
            </li>
        )
    }
}


  
  export default SingleView;