import React, {Component} from 'react';

class Header extends Component{
  render(){
    return (
      <header id="header">
          <div className="container">
              {/* Display Title */}
              <hr className="my-3" />
              <h4 className="display-4 font-weight-bold text-right">Interactive Image Generator</h4>
              <p className="lead text-right">with Generative Adversarial Network</p>
              <hr className="my-3" />
          </div>
      </header>
  );}
}
export default Header;