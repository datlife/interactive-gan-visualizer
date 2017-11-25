import React from 'react';
import {fabric} from 'fabric';

// Redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as fabricCanvasActions from '../redux/actions/fabricCanvasHandler';
import * as objectHandlder from '../redux/actions/bboxHandler';

const mapDispatchToProps = (dispatch) => ({
  canvasActions: bindActionCreators(fabricCanvasActions, dispatch),
  objectHandlder: bindActionCreators(objectHandlder, dispatch)
});

class Photo extends React.Component {
    constructor(props){
      super(props);
      this.fabricCanvas = new fabric.Canvas();
    }

    componentDidMount(){  
      const {background, id} = this.props;
      const {canvasActions, objectHandlder} = this.props;  

      let canvas = this.fabricCanvas;
      canvas.initialize(this.refs.canvas, {width: 400, height:400});

      fabric.Image.fromURL(background, function(image){
        image.set({width: 400, height:400});
        canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas));
        canvasActions.initialize(id, canvas);                
      }.bind(canvas),{ crossOrigin: 'Anonymous' });

      canvas.on('object:scaling',   (evt) => objectHandlder.scaling(canvas, id, evt));
      canvas.on('object:selected',   (evt) => objectHandlder.select(canvas, id, evt));
      
    } 

    reload(){
      let {view, id} = this.props;
      if(view){
        let canvas = this.fabricCanvas;
        canvas.loadFromJSON(view.canvas);
        console.log("Reloading "+ id) 
      }   
    }

    render() {    
      this.reload();
      return (
        <div>
          <canvas ref="canvas" />
          <p className="lead text-center">{this.props.caption}</p>   
        </div>
      )
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (JSON.stringify(this.fabricCanvas) === nextProps.view.canvas){
        return false;
      }
      return true;
    }
}

export default connect(null, mapDispatchToProps)(Photo);



      
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


      // canvas.on('object:moving',   (evt) => objectHandlers.moving(evt.target));
      // canvas.on('object:modified', (evt) => objectHandlers.modified(evt.target));
      // canvas.on('object:scaling',  (evt) => objectHandlers.scaling(evt.target));
      // canvas.on('selection:cleared', ()  => objectHandlers.cleared()); 