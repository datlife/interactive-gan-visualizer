import React, {Component} from 'react';
import Image from './image';

class Content extends Component{
  render(){
    return (
      <div className="body container">
          {/* Upload Image  */}
          <div className="row">
            <div className="col-10" >
              <form className="form-group">
                    <input type="file" className="form-control" placeholder="Browse an image" />
              </form>
            </div>
            <div className="col-2">
              <button type="submit" className="btn btn-primary btn-large">Upload</button>
            </div>
          </div>

          {/* Display Image  */}
          <Image />
      </div>
    );
  }
}

export default Content;