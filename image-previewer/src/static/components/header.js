import React, {Component} from 'react';


class Header extends Component{
  render(){
    return (
      <header id="header">
          <div className="jumbotron">
              {/* Display Title */}
              <div className="app-title">
                <h4 className="display-4 font-weight-bold">Interactive Image Generator</h4>
                <p className="lead">with Generative Adversarial Network</p>
                <hr className="my-4" />
              </div>
              {/* Upload Image  */}
              <form className="form-group">
                    <input type="file" className="form-control" placeholder="Browse an image" />
              </form>
              <button type="submit" className="btn btn-primary btn-large flex">Upload</button>

          </div>
      </header>
  );}
}
export default Header;