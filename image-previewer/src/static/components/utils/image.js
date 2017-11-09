import React, {Component} from 'react';
import {Layer, Stage, Image} from 'react-konva';

class Photo extends Component{
    constructor(props){
      super(props);
      this.state = {
          image: null
        }
    }
    
    componentDidMount() {
      const image = new window.Image();
      image.src = this.props.img.preview;
      image.width = 448;
      image.height= 448;
      image.onload = () => {
        this.setState({
          image: image
        });
      }
    }
    render(){
      // const image = this.props.img.preview;
      const caption = this.props.caption;
      
      return (
        <div className="photo-box">
              <Stage width={448} height={448} className="figure-img">
                <Layer>
                    <Image image={this.state.image} />
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