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
      }, { crossOrigin: 'Anonymous' });

      // canvas.on('object:modified',   (evt) => objectHandlder.scaling(canvas, id, evt));
      canvas.on('object:moving',     (evt) => objectHandlder.moving(canvas, id, evt));     
      canvas.on('object:selected',   (evt) => objectHandlder.select(canvas, id, evt));
      canvas.on('mouse:up',          (evt) => objectHandlder.moving(canvas, id, evt));                  
      
    } 

    reload(){
      let {view} = this.props;
      if(view){
        let canvas = this.fabricCanvas;        
        canvas.loadFromJSON(view.canvas);
        if(view.confirmed){
          console.log("CONFIRMED")
          let fixed_obj =   canvas.getObjects()[0]
          console.log(fixed_obj)
        }
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
