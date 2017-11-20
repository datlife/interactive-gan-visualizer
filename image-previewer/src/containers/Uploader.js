import React from 'react';
import Dropzone from 'react-dropzone';

// Redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {uploadImage} from '../redux/actions/imageHandler';

function mapDispatchToProps(dispatch) {
  return bindActionCreators({uploadImage}, dispatch)
}

class Uploader extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="span6">
          <Dropzone
            className="dropzone"
            accept="image/jpeg, image/png"
            onDrop={(new_images) => this.props.uploadImage(new_images)}>
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
