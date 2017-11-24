import React from 'react';
import {fabric} from 'fabric';

class Photo extends React.Component {
    constructor(props){
      super(props);
      this.fabricCanvas = new fabric.Canvas();
    }

    componentDidMount(){
      let canvas = this.fabricCanvas;
      
      const {background, id} = this.props;
      const {fabricCanvasActions, objectHandlers} = this.props;  

      canvas.initialize(this.refs.canvas, {width: 400, height:400});

      fabric.Image.fromURL(background, function(image){
        image.set({width: 400, height:400});
        canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas));
        fabricCanvasActions.initialize(id, canvas);                
      }.bind(canvas),{ crossOrigin: 'Anonymous' });

    canvas.on('object:selected', (evt) => objectHandlers.selected(evt.target));
    canvas.on('object:moving',   (evt) => objectHandlers.moving(evt.target));
    canvas.on('object:modified', (evt) => objectHandlers.modified(evt.target));
    canvas.on('object:scaling',  (evt) => objectHandlers.scaling(evt.target));
    canvas.on('selection:cleared', ()  => objectHandlers.cleared()); 
    console.log("did mount " + id);      
    } 
    componentDidUpdate(){
      let {id, fabricCanvas, bboxes, background} = this.props;
      let canvas = this.fabricCanvas;
      
      // fabricCanvas.add(object);
      // fabricCanvas.setActiveObjesct(object);
      // if (bboxes){
      //   console.log("I am adding new bboxes in " + id);
      //   let objects = bboxes.bboxes;
      //   console.log(objects);
      //   fabric.util.enlivenObjects(objects, function(objects) {
      //     var origRenderOnAddRemove = canvas.renderOnAddRemove;
      //     canvas.renderOnAddRemove = false;
          
      //     objects.forEach(function(o) {
      //       canvas.add(o);
      //     });
        
      //     canvas.renderOnAddRemove = origRenderOnAddRemove;
      //     canvas.renderAll();
      //   });

        
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




// if(fabricCanvas){
//   canvas.loadFromJSON(fabricCanvas.canvas);
// }
// canvas.loadFromJSON(fabricCanvas.canvas, function(){
//   fabric.Image.fromURL(background, function(image){
//     canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
//       width: 400, height:400, 
//       hasControls: false, selectable: false
//    });
//   },{});
//   canvas.renderAll();
// }.bind(canvas));    