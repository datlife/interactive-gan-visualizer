import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {fabric} from 'fabric';

export default class Canvas extends React.Component {
  componentDidMount() {
    const {id, height, width} = this.props;
    const el = ReactDOM.findDOMNode(this);
    this.props.initialize(el, id, height, width);    
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
