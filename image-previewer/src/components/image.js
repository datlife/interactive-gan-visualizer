import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Canvas from './Canvas';
import {fabric} from 'fabric';

class Photo extends React.Component {
    componentDidMount(){
      const { objectHandlers, fabricCanvasActions, image} = this.props;
      const {fabricCanvas} = this.props;
      // const thisCanvas = fabricCanvas.byIds.id.canvas;
      // thisCanvas.on('object:selected', (evt) => objectHandlers.selected(evt.target));
      // thisCanvas.on('object:moving',   (evt) => objectHandlers.moving(evt.target));
      // thisCanvas.on('object:modified', (evt) => objectHandlers.modified(evt.target));
      // thisCanvas.on('object:scaling',  (evt) => objectHandlers.scaling(evt.target));
      // thisCanvas.on('selection:cleared', ()  => objectHandlers.cleared());

      // // fabric.Image.fromURL(image.preview, (img)=>{
      //   img.set({selectable: false, hasControls: false}); // not allow image to move
      //   fabricCanvasActions.addObject(this.props.id, img);
      // }, {crossOrigin: 'anonymous'});
    }

     render() {
      let { fabricCanvasActions,id, ...props } = this.props;
        return (
          <div>
            <Canvas id={id} initialize={fabricCanvasActions.initialize} width={400} height={400}  />
            <p className="lead text-center">{this.props.caption}</p>    
          </div>
        )
     }
}

export default Photo;