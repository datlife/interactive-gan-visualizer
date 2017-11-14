import React from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';

// Just a bunch of Material UI components
import CropIcon from 'material-ui/svg-icons/image/crop-free';
import UndoIcon from 'material-ui/svg-icons/content/undo';
import RedoIcon from 'material-ui/svg-icons/content/redo';
import SaveIcon from 'material-ui/svg-icons/content/save';

import {Card, IconButton, GridList, MenuItem, Slider, SelectField,
  Toggle, ToolbarSeparator, RaisedButton} from 'material-ui';

import * as canvasActions from '../redux/actions/fabricCanvas';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const mapStateToProps = (state) => ({
  url: state.exportObject.url,
});

const mapDispatchToProps = (dispatch) => ({
  canvasActions: bindActionCreators(canvasActions, dispatch),
});


class Toolbar extends React.Component {
  _addBox = () => {
    console.log("generating new image");
    let canvasActions = this.props.canvasActions;
    console.log(canvasActions);
    const rect = new fabric.Rect({
      top: 10,
      left: 10,
      width: 10,
      height: 10,
      fill: 'red',
    });
    canvasActions.addObject(rect);    
  }

  _save(){
    this.props.canvasActions.toDataURL();    
  }

  render() {
    return (
      <div className="d-flex flex-row">
        <div className="p-2">
          <div className="d-flex flex-column">
            <RaisedButton className="mt-0" label="Clear" primary={true}/>
            <RaisedButton className="mt-2" label="Process" secondary={true}/>
            <Toggle       className="mt-3 toggle" label="Debug" onToggle={(e) => this.props.toggleDebug(e)}/>
          </div>
        </div>

        <div className="p-2">
          <Card className="d-flex flex-column">
            <IconButton className="mt-0" onClick={this._addBox}>
                <CropIcon />
            </IconButton>
            <IconButton className="mt-0" onClick={this._save}>
                <SaveIcon/>
            </IconButton>
          </Card>
        </div>
      </div>
    )
  }
}

export default  connect(
  mapStateToProps,
  mapDispatchToProps)(Toolbar);

// Toolbar.propTypes = {
//   onToDataURL: PropTypes.func,
//   onAddObject: PropTypes.func,
//   url: PropTypes.string,
// };