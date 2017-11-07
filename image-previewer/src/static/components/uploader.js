import React, {Component} from 'react';
import Dropzone from 'react-dropzone';

class Uploader extends Component{
    render(){
        return(
            <div className="row">
              <div className="col-10">
                <Dropzone className="uploader" multiple={false} accept="image/*">
                    <p className="text-center">Drop an image or click to select a file to upload.</p>
                </Dropzone>
              </div>
               

            <div className="col-2">
              <button type="submit" className="btn btn-primary btn-large">Upload</button>
            </div>
          </div>
        )
    }
}

export default Uploader;