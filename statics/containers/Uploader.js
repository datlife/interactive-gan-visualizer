import React from 'react';
import Dropzone from 'react-dropzone';

// Redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ImageHandler from '../redux/actions/imageHandler';

const mapDispatchToProps = (dispatch) => ({
  ImageHandler: bindActionCreators(ImageHandler, dispatch),
});

class Uploader extends React.Component {
  render() {
    let {ImageHandler} = this.props;
    return (
      <div className="row">
        <div className="span6">
          <Dropzone
            className="dropzone"
            accept="image/jpeg, image/png"
            onDrop={(new_images) => {
              console.log(new_images)
              ImageHandler.uploadImage(new_images)
              
            }}>
            <div className="d-flex align-items-center">
              <p className="lead">Click or Drop to upload more images.</p>
            </div>
          </Dropzone>
        </div>
      </div>
    )
  }
}

export default connect(null, mapDispatchToProps)(Uploader);
