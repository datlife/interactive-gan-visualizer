import React, {Component} from 'react';
import {connect} from 'react-redux';
import SingleView from './utils/single_item';
import {bindActionCreators} from 'redux';

let example = {preview: require("../../assets/cute-cat.jpg")} // Example : cute cat
class Content extends Component{
  render(){
    const images = this.props.images;
    console.log(images);
    return (   
        <div className="container"> 
            <ul className="list-group">
              <SingleView img={example} />
              {images  ? images.map((image) => { 
                  return <SingleView key={image.name} img={image}/> 
              }) : null}
            </ul>
        </div>
    );
  }
} 

function mapStatesToProps(state){
  console.log(state);
  return {
    images: state.images
  }
}

// Update Content React Component to a container - it needs to know
// about this new dispatch method, uploadImage. Make it available as a prop
export default connect(mapStatesToProps)(Content);
