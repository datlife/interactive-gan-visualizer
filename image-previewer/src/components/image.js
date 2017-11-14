import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Canvas from './Canvas';
import * as objectHandlerActions from '../redux/actions/objectHandler';
import * as fabricCanvasActions from '../redux/actions/fabricCanvas';

import {fabric} from 'fabric';

const mapStateToProps = state => ({
  fabricCanvas: state.fabricCanvas,
});

const mapDispatchToProps = (dispatch) => ({
  objectHandlers: bindActionCreators(objectHandlerActions, dispatch),
  fabricCanvasActions: bindActionCreators(fabricCanvasActions, dispatch),
  
});

class Photo extends React.Component {
    componentDidMount(){
      const { objectHandlers, fabricCanvasActions, img} = this.props;
      let fabricCanvas =  new fabric.Canvas();
      fabricCanvas.on('object:selected', (evt) => objectHandlers.selected(evt.target));
      fabricCanvas.on('object:moving', (evt)   => objectHandlers.moving(evt.target));
      fabricCanvas.on('object:modified', (evt) => objectHandlers.modified(evt.target));
      fabricCanvas.on('object:scaling', (evt)  => objectHandlers.scaling(evt.target));
      fabricCanvas.on('selection:cleared', ()  => objectHandlers.cleared());

      fabric.Image.fromURL(img.preview, (img)=>{
        fabricCanvasActions.addObject(img);
      });
    }
      
  
     render() {
      const { fabricCanvasActions } = this.props;
      
        return (
          <div>
            <Canvas initialize={fabricCanvasActions.initialize} width={400} height={400} />
          </div>
        )
     }
}

export default connect(mapStateToProps,mapDispatchToProps)(Photo);