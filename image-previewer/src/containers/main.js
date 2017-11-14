// React
import React, {Component} from 'react';
import SingleView from '../components/single_item';

// Redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {deleteImage} from '../redux/actions/uploadImage';


function mapStatesToProps(state){
  console.log(state);
  return {
    images: state.images,
  }
}

const mapDispatchToProps = (dispatch) => ({
  deleteImage: bindActionCreators(deleteImage, dispatch),
});

class Content extends Component{
  render(){
    let images = this.props.images;
    return (   
        <div className="container-fluid"> 
          <ul className="list-group">{
            images.length  
            ? images.map((image, id) => {return <SingleView  key={image.preview} id={id} 
                                                              img={image} 
                                                              removeItem={this.props.deleteImage} /> }) 
            : null}
          </ul>
        </div>
    );
  }
} 


export default connect(mapStatesToProps, mapDispatchToProps)(Content);
