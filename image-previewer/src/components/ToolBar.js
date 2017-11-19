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


class Toolbar extends React.Component {

  _addBox = () => {
    let {canvas_id, actions} = this.props;
    const rect = new fabric.Rect({
      top: 10,
      left: 10,
      width: 10,
      height: 10,
      fill: 'red',
    });
    actions.addObject(canvas_id, rect);    
  }

  _save(){
    this.props.actions.toDataURL();    
  }

  render() {
    return (
      <div className="d-flex flex-row">
        <div className="p-2">
          <div className="d-flex flex-column">
            <RaisedButton className="mt-0" label="Clear" primary={true}/>
            <RaisedButton className="mt-2" label="Process" secondary={true}/>
            <Toggle       className="mt-3 toggle" label="Debug" 
                          onToggle={(e) => this.props.toggleDebug()}/>
          </div>
        </div>

        <div className="p-2">
          <Card className="d-flex flex-column">
            <IconButton className="mt-0" onClick={this._addBox.bind(this)}>
                <CropIcon />
            </IconButton>
            <IconButton className="mt-0" onClick={this._save.bind(this)}>
                <SaveIcon/>
            </IconButton>
          </Card>
        </div>
      </div>
    )
  }
}

export default Toolbar;