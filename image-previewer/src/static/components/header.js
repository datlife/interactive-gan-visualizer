import React, {Component} from 'react';


class Header extends Component{
  render(){
  return (
    <header id="header">
        <div className="jumbotron">
            <h4 className="display-4 font-weight-bold">Interactive Image Generator</h4>
            <p className="lead">with Generative Adversarial Network</p>
            <hr className="my-4" />

            <form onSubmit={evt => {evt.preventDefault();}}>
                <label className="custom-file">
                  <input type="file" id="file" className="custom-file-input" />
                  <span className="custom-file-control"></span>
                </label>
              <button type="submit" className="btn btn-primary btn-large float-right">Upload</button>
            </form>
        </div>
    </header>
  );}
}
export default Header;