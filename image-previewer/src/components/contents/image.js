import React, {Component} from 'react';
import {Layer, Stage, Image, Rect} from 'react-konva';

class Photo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      bboxes: []
    }
  }

  componentDidMount() {
    const image = new window.Image();
    image.src = this.props.img;
    image.width = 300;
    image.height = 300;
    image.onload = () => {
      this.setState({image: image});
    }
  }

  render() {
    const caption = this.props.caption;

    return (
      <div className="photo-box">
        <Stage width={300} height={300} className="figure-img">
          <Layer>{
            this.state.image
              ? <Image image={this.state.image}/>
              : null}
          </Layer>
        </Stage>
        <figcaption>
          <p className="lead text-center">{caption}</p>
        </figcaption>
      </div>
    );
  }

}

export default Photo;