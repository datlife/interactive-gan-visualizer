import React from 'react';
import CropIcon from 'material-ui/svg-icons/image/crop-free';
import UndoIcon from 'material-ui/svg-icons/content/undo';
import RedoIcon from 'material-ui/svg-icons/content/redo';

import {
  Card,
  IconButton,
  GridList,
  MenuItem,
  Slider,
  SelectField,
  Toggle,
  ToolbarSeparator,
  RaisedButton
} from 'material-ui';

class Buttons extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      canUndo: true,
      canRedo: true,
    }
  }

  _undo(){
    console.log("undo");
  }

  _redo(){
    console.log("redo");
    
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
            <IconButton className="mt-0"
                onClick={this._redo}
                disabled={!this.state.canRedo}>
                <CropIcon />
            </IconButton>
            <IconButton className="mt-0"
                onClick={this._undo}
                disabled={!this.state.canUndo}>
                <UndoIcon />
            </IconButton>
            <IconButton className="mt-0"
                onClick={this._redo}
                disabled={!this.state.canRedo}>
                <RedoIcon/>
            </IconButton>
          </Card>
        </div>
        {/* TODO 
          * 1. Add cropping button
          * 2. Add Undo/Redo buttons
          * 3. Add select button
          */}
      </div>
    )
  }
}

export default Buttons;