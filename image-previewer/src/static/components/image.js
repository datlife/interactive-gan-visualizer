import React, {Component} from 'react';


class Image extends Component{
    render(){
      const image = this.props.img;

      return (
        <div className="photo-box">
            <img src={image.preview} className="figure-img img-fluid"/>
            <figcaption>
              <p className="lead text-center">{this.props.caption}</p>
            </figcaption>
        </div>
      );
    }
  }
  
export default Image;