import React from 'react';
var createClass = require('create-react-class');

const Header = createClass({
  render(){
  return (
    <header id="header">
      <div className="content container text-center">
        <h1>Interactive Image Generator</h1>
        <form onSubmit={evt => {
          evt.preventDefault();
        }
        }>
          <div className="form-group">
            <label className="image-holder">Add a new image</label>
            <input autoComplete="off" 
                   className="form-control input-lg" 
                   name="taskName" 
                   placeholder="browser an image" />
          </div>
          <button type="submit">Upload</button>
        </form>
      </div>
    </header>
  );
}
});
export default Header;