import React from 'react';
import {fabric} from 'fabric';

class Photo extends React.Component {

    componentDidMount(){
      const {background, id} = this.props;
      const {fabricCanvasActions, objectHandlers} = this.props;  
      
      fabric.util.loadImage(background, function(img){
          var image = new fabric.Image(img);
          image.set({width: 400, height:400, hasControls: false, selectable: false});
          fabricCanvasActions.addObject(id, image);  
        });
      
      
      // fabricCanvas.on('object:selected', (evt) => objectHandlers.selected(evt.target));
      // fabricCanvas.on('object:moving',   (evt) => objectHandlers.moving(evt.target));
      // fabricCanvas.on('object:modified', (evt) => objectHandlers.modified(evt.target));
      // fabricCanvas.on('object:scaling',  (evt) => objectHandlers.scaling(evt.target));
      // fabricCanvas.on('selection:cleared', ()  => objectHandlers.cleared());  
    } 
    render() {    
      return (
        <div>
          <Canvas id={this.props.id} initialize={this.props.fabricCanvasActions.initialize} width={400} height={400}/>
          <p className="lead text-center">{this.props.caption}</p>   
        </div>
      )
    }
}

class Canvas extends React.Component{
  componentDidMount(){
    let{id, initialize, width, height} = this.props;
    const el = this.refs.canvas;    
    var fabricCanvas = new fabric.Canvas();      
    fabricCanvas.initialize(el, {width: 400, height:400}); 
    initialize(id, fabricCanvas);
  }

  render(){
    return(
      <canvas ref="canvas" />
    );
  }
}

export default Photo;