import React from 'react';
var createClass = require('create-react-class');


const Header = createClass({
  render(){
  return (
    <header id="header">
        <div className="jumbotron">
            <p class="display-4 font-weight-bold">Interactive Image Generator</p>
            <form onSubmit={evt => {
              evt.preventDefault();
            }
            }>
              <div className="form-group">
                <input autoComplete="off" 
                      className="form-control input-lg" 
                      name="taskName" 
                      placeholder="Browse an image or Enter an image URL" />
              </div>
            </form>

            <button type="submit" className="btn btn-primary btn-large float-right">Upload</button>
        </div>
    </header>
  );
}
});
export default Header;