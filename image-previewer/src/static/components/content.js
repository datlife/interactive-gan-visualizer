import React, {Component} from 'react';
import SingleView from './single_item';

let example = {preview: require("../../assets/cute-cat.jpg")}

class Content extends Component{
  render(){
    const images = this.props.images;
    return (   
        <div> 
            <ul className="list-group">
              <SingleView img={example} />
              {images.length  ? images.map((image) => { return <SingleView img={image}/> }) : null}
            </ul>
        </div>
    );
  }
} 

export default Content;
