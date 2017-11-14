import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Canvas extends React.Component {
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.props.initialize(
      el,
      this.props.height,
      this.props.width,
    );
  }

  render() {
    return (
      <canvas id="mainCanvas" />
    );
  }
}


Canvas.propTypes = {
  initialize:PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
};
