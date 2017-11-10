// React
import React, {Component} from 'react';
import SingleView from './contents/single_item';

// Redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {deleteImage} from '../redux/actions';

class Content extends Component{
  render(){
    const images = this.props.images;
    console.log(images);
    return (   
        <div className="container"> 
          <ul className="list-group">{
            images  
            ? images.map((image, id) => { return <SingleView  key={image.preview} id={id} 
                                                              img={image} removeItem={this.props.deleteImage} /> }) 
            : null}
          </ul>
        </div>
    );
  }
} 

function mapStatesToProps(state){
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
