import React, {Component} from 'react';


class Image extends Component{
  constructor(props) {
    super(props);
  }
  render(){
    return (
      <div className="photo-box">
        <figure>
          <img src={this.props.src} className="figure-img img-fluid"/>
          <figcaption>
            <p className="lead text-center">{this.props.caption}</p>
          </figcaption>
        </figure>
      </div>
    );
  }
}

export default Image;
