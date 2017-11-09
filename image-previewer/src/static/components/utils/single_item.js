import React from 'react';
import Photo from './image';
import Buttons from './buttons';

class SingleView extends React.Component{
    render(){
        return(
            <li className="list-group-item">
                <div className="row">
                    <div  className="col-1.5"> <Buttons id="controllers"/></div>
                    <div className="col-10">
                        <div className=" d-flex justify-content-around">
                            <Photo img={this.props.img} caption={"Original Image"} />
                            <Photo img={this.props.img} caption={"Generated Image"} />
                        </div>
                    </div>
                </div>

            </li>
        )
    }
}


  
  export default SingleView;