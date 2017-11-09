import React, {Component} from 'react';
import SingleView from './utils/single_item';
import {connect} from 'react-redux';


// Example : cute cat
let example = {preview: require("../../assets/cute-cat.jpg")}

class Content extends Component{
  render(){
    const images = this.props.images;
    return (   
        <div className="container"> 
            <ul className="list-group">
              <SingleView img={example} />
              {images.length  ? images.map((image) => { return <SingleView img={image}/> }) : null}
            </ul>
        </div>
    );
  }
} 

function mapStatesToProps(state){
  return {
    images = state.images
  };
}

export default connect(mapStatesToProps)(Content);
