import React from 'react';
import {fabric} from 'fabric';

class Photo extends React.Component {

    componentDidMount(){
      // const { objectHandlers, fabricCanvasActions, image} = this.props;
      const {background, id} = this.props;
      const {fabricCanvasActions, objectHandlers} = this.props;

      const el = this.refs.canvas;    
      const fabricCanvas = new fabric.Canvas();      
      fabricCanvas.initialize(el, {width: 400, height:400});    
      fabricCanvasActions.initialize(el, id, fabricCanvas, background);    
      
      fabricCanvas.on('object:selected', (evt) => objectHandlers.selected(evt.target));
      fabricCanvas.on('object:moving',   (evt) => objectHandlers.moving(evt.target));
      fabricCanvas.on('object:modified', (evt) => objectHandlers.modified(evt.target));
      fabricCanvas.on('object:scaling',  (evt) => objectHandlers.scaling(evt.target));
      fabricCanvas.on('selection:cleared', ()  => objectHandlers.cleared());      
      }      

     render() {       
        return (
          <div>
            <canvas ref="canvas"/>
            <p className="lead text-center">{this.props.caption}</p>    
          </div>
        )
     }
}

export default Photo;