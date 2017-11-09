import React from 'react';


class Buttons extends React.Component{
    render(){
      return(
        <div className="d-flex flex-column">
            <div className="p-2  btn-group-vertical  btn-group-custom">
                <button id="detect-cars" className="btn btn-primary">Detect Cars</button>
                <button id="custom-box"  className="btn btn-primary">Custom Box</button>
                <button id="clear-box"   className="btn btn-primary">Clear</button>
            </div>
            <div className="mt-auto p-2  btn-group-vertical ">
                <button id="process"   className="btn btn-success btn-large">Process</button>
            </div>
        </div>
      )
    }
  }
  
  export default Buttons;