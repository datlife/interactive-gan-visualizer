import React from 'react';
import {fabric} from 'fabric';

class Photo extends React.Component {

    constructor(props){
      super(props);
      this.fabricCanvas = new fabric.Canvas();
    }
    componentDidMount(){
      const el = this.refs.canvas;    
      const fabricCanvas = this.fabricCanvas;

      const {background, id} = this.props;
      const {fabricCanvasActions, objectHandlers} = this.props;  

      fabricCanvas.initialize(el, {width: 400, height:400});
      fabricCanvasActions.initialize(id, fabricCanvas);        

      fabricCanvas.on('object:selected', (evt) => objectHandlers.selected(evt.target));
      fabricCanvas.on('object:moving',   (evt) => objectHandlers.moving(evt.target));
      fabricCanvas.on('object:modified', (evt) => objectHandlers.modified(evt.target));
      fabricCanvas.on('object:scaling',  (evt) => objectHandlers.scaling(evt.target));
      fabricCanvas.on('selection:cleared', ()  => objectHandlers.cleared());  
    } 
    componentDidUpdate(){
      let {id, fabricCanvas, background} = this.props;
      let canvas = this.fabricCanvas;
      
      if (fabricCanvas){
        canvas.loadFromJSON(fabricCanvas.canvas, function(){
          fabric.Image.fromURL(background, function(image){
            canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
              width: 400, height:400, 
              hasControls: false, selectable: false
           });
          },{});
          canvas.renderAll();
        }.bind(canvas));           
      }
    }

    render() {    
      return (
        <div>
        <canvas ref="canvas" />
        <p className="lead text-center">{this.props.caption}</p>   
        </div>
      )
    }
}

export default Photo;