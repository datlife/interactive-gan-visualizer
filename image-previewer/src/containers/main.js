// React
import React, {Component} from 'react';
import SingleView from '../components/single_item';

// Redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {deleteImage} from '../redux/actions/imageHandler';
import * as objectHandlerActions from '../redux/actions/objectHandler';
import * as fabricCanvasActions from '../redux/actions/fabricCanvas';

function mapStatesToProps(state){
  return {
    images: state.images,
    fabricCanvas: state.fabricCanvas      
  }
}
const mapDispatchToProps = (dispatch) => ({
  deleteImage: bindActionCreators(deleteImage, dispatch),
  objectHandlers: bindActionCreators(objectHandlerActions, dispatch),
  fabricCanvasActions: bindActionCreators(fabricCanvasActions, dispatch),
});


class Content extends Component{
  render(){
    let {images, ...props} = this.props;
    return (   
        <div className="container-fluid"> 
          <ul className="list-group">{
            images.length  
            ? images.map((image, id) => {return <SingleView  key={image.preview} 
                                                             id={id} 
                                                             image={image} {...props} /> }) 
            : null}
          </ul>
        </div>
    );
  }
} 

export default connect(mapStatesToProps, mapDispatchToProps)(Content);
