// React
import React from 'react';
import SingleView from '../components/SingleView';

// Redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as objectHandlerActions from '../redux/actions/bboxHandler';
import * as fabricCanvasActions from '../redux/actions/fabricCanvasHandler';
import * as ImageHandler from '../redux/actions/imageHandler';

function mapStatesToProps(state){
  return {
    images: state.images,
    views:  state.views,
    
  }
}

const mapDispatchToProps = (dispatch) => ({
  ImageHandler: bindActionCreators(ImageHandler, dispatch),
  objectHandlers: bindActionCreators(objectHandlerActions, dispatch),
  fabricCanvasActions: bindActionCreators(fabricCanvasActions, dispatch),
});


class Content extends React.Component{
  /*
  * for every new added image, this will generate a SingleView consisting of:
       1. An original input image view (fabricCanvas)
       2. A  generated output image    (fabricCanvas)
       3. A  debug output image (mask in FabricCanvas)
       4. a  list of bboxes
       5. other states (debug toggle, etc)
  */
  render(){
    let {images, ...props} = this.props;
    return (   
        <div className="container-fluid"> 
          <ul className="list-group">{
            images.allIds.length  
            ? images.allIds.map((id) => {
                  return <SingleView  key={id} id={id} 
                                      image={images.byId[id]} 
                                      {...props} /> }) 
            : null}
          </ul>
        </div>
    );
  }
} 

export default connect(mapStatesToProps, mapDispatchToProps)(Content);
