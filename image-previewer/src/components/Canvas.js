import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {fabric} from 'fabric';

export default class Canvas extends React.Component {
  componentDidMount() {
    const {id, height, width} = this.props;
    let canvas = new fabric.Canvas();
    const el = ReactDOM.findDOMNode(this);
    canvas.initialize(el, height, width);    
    this.props.initialize(id, canvas);
  }

  render() {
    return (
      <canvas id={this.props.id}/>
    );
  }
}


Canvas.propTypes = {
  initialize:PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
};
