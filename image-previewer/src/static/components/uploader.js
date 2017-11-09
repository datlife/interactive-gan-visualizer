import React, {Component} from 'react';
import Dropzone from 'react-dropzone';

class Uploader extends Component{
    render(){
        return(
          <div className="row">
            <div className="span6 center">
                <Dropzone
                    className="dropzone"
                    accept="image/jpeg, image/png"
                    onDrop={(images) => this.props.onLoad(images)}>
                    <div className="d-flex align-items-center">
                        <p className="lead">Drop or Click to upload images.</p>
                    </div>
                </Dropzone>
            </div>
          </div>
        )
    }
}

export default Uploader;