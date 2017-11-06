import React, {Component} from 'react';

const background = {
    backgroundImage: "url(" + require("../../assets/header.jpg") + ")"
}

class Header extends Component{
  render(){
    return (
      <header id="header" style={background}>
          <div className="container">
              {/* Display Title */}
              <hr className="my-3" />
              <h4 className="display-4 font-weight-bold text-right text-white">Interactive Image Generator</h4>
              <p className="lead text-right text-white">with Generative Adversarial Network</p>
              <hr className="my-3" />
          </div>
      </header>
  );}
}
export default Header;