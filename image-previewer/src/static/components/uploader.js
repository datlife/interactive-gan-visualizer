import React, {Component} from 'react';

class Uploader extends Component{
    render(){
        return(
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
        )
    }
}

export default Uploader;