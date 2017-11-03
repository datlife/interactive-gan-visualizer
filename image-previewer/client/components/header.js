import React from 'react';

const Header = (props) => {
  return (
    <header id="header">
      <div className="content container text-center">
        <h1>Interactive Image Generator</h1>
        <form onSubmit={evt => {
          evt.preventDefault();
          props.postNewTask(evt.target.taskName.value);
          evt.target.taskName.value = "";
        }
        }>
          <div className="form-group">
            <label for="exampleInputEmail1">Add a new image</label>
            <input autoComplete="off" 
                   className="form-control input-lg" 
                   name="taskName" 
                   placeholder="Enter new task" />
          </div>
          <button type="submit">Upload</button>
        </form>
      </div>
    </header>
  );
};
export default Header;