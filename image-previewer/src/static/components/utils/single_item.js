import React from 'react';
import Photo from './image';
import Buttons from './buttons';

class SingleView extends React.Component{
    render(){
        return(
            <li className="list-group-item">
                <div className="d-flex">
                    <div  className="col-1.5"> <Buttons id="controllers"/></div>
                    <div className="col-10.5">
                        <div className="d-flex justify-content-between">
                            <div className="p-2"><Photo img={this.props.img} caption={"Original Image"} /></div>
                            <div className="p-2"><Photo img={this.props.img} caption={"Generated Image"} /></div>
                        </div>
                    </div>
                </div>

            </li>
        )
    }
}


  
  export default SingleView;