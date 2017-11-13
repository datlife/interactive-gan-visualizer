import React, {Component} from 'react';
import {Layer, Stage, Image, Group, Rect} from 'react-konva';


class Photo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      bboxes: null
    }
  }

  componentDidMount() {
    const image = new window.Image();
    image.src = this.props.img;
    image.width = 400;
    image.height = 400;
    image.onload = () => {
      /* loading animation */
      this.setState({image: image});
    }
  }
  
  render() {
    const caption = this.props.caption;
    return (
      <div className="photo-box">
        <Stage width={400} height={400} className="figure-img">
          <Layer>{
            this.state.image
              ? <Image ref="img" image={this.state.image}/>
              : null}
          </Layer>
          <Layer>{this.state.bboxes
              ? <Rect />
              : null}
          </Layer>
        </Stage>
          <div className="caption lead text-center">{caption}</div>
      </div>
    );
  }

}

export default Photo;