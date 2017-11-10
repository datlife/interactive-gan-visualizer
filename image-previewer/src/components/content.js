import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import SingleView from './utils/single_item';
import {deleteImage} from '../redux/actions';

class Content extends Component{
  render(){
    const images = this.props.images;
    return (   
        <div className="container"> 
          <ul className="list-group">
            {images  ? 
                images.map((image, idx) => { 
                return <SingleView  key={idx} 
                                    img={image} 
                                    removeOnClick={this.props.deleteImage(idx)}/> }) 
            : null}
          </ul>
        </div>
    );
  }
} 

function mapStatesToProps(state){
  console.log("Current state");
  console.log(state);
  return {
    images: state.images
  }
}
function mapDispatchToProps(dispatch){
  return bindActionCreators({
    deleteImage: deleteImage
  }, dispatch)
}

export default connect(mapStatesToProps, mapDispatchToProps)(Content);
