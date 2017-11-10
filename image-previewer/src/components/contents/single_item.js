import React from 'react';
import Photo from './image';
import Buttons from './buttons';

class SingleView extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        const image = this.props.img.preview;

        return(
            <li className="list-group-item">
                <div className="d-flex">
                    <div  className="col-1.5"> 
                        <Buttons id="controllers"/>
                    </div>
                    <div className="col-10.5">
                        <div className="d-flex justify-content-between">
                            <div className="p-2"><Photo img={image} caption={"Original Image"} /></div>
                            <div className="p-2"><Photo img={image} caption={"Generated Image"} /></div>
                        </div>
                    </div>
                </div>

                <div className="hover-btn">
                    <button className="close" onClick={() => this.props.removeItem(this.props.id)}>
                        <span aria-hidden="true">×</span>
                    </button>  
                </div>
            </li>
        )
    }
}


  
  export default SingleView;