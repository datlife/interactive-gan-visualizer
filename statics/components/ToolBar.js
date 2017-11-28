import React from 'react';
import { fabric } from 'fabric';

// Just a bunch of Material UI components
import AddIcon from 'material-ui/svg-icons/content/add';
import DoneIcon from 'material-ui/svg-icons/action/done';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import SaveIcon from 'material-ui/svg-icons/content/save';
import {Card, IconButton, GridList, MenuItem, Slider, SelectField,
  Toggle, ToolbarSeparator, RaisedButton} from 'material-ui';

// Redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as fabricCanvasActions from '../redux/actions/fabricCanvasHandler';

const mapDispatchToProps = (dispatch) => ({
  fabricCanvasActions: bindActionCreators(fabricCanvasActions, dispatch),
});


class Toolbar extends React.Component {

  render() {
    let {canvas_id, ImageHandler, isDebugging} = this.props;
    return (
      <div className="d-flex flex-row">
        <div className="p-2">
          <div className="d-flex flex-column">
            <RaisedButton className="mt-0" label="Detect" primary={true} onClick={this._detect.bind(this)}/>
            <RaisedButton className="mt-2" label="Process" secondary={true}/>
            <Toggle       className="mt-3 toggle" label="Debug" 
                          onToggle={(e) => ImageHandler.changeDebugMode(canvas_id, isDebugging)}/>
          </div>
        </div>

        <div className="p-2">
          <Card className="d-flex flex-column">
            <IconButton className="mt-0">
                <DoneIcon />
            </IconButton>
            <IconButton className="mt-0" onClick={this._addBox.bind(this)}>
                <AddIcon />
            </IconButton>
            {/* <IconButton className="mt-0">
                <ClearIcon />
            </IconButton> */}
            <IconButton className="mt-0" onClick={this._save.bind(this)}>
                <SaveIcon/>
            </IconButton>
          </Card>
        </div>
      </div>
    )
  }

  _detect = () => {
    let {canvas_id, fabricCanvasActions} = this.props;
    fabricCanvasActions.detectObjects(canvas_id);
  }
  
  _addBox = () => {
    let {canvas_id, fabricCanvasActions} = this.props;
    const rect = new fabric.Rect({
      top: 10,
      left: 10,
      width: 50,
      height: 50,
      hasBorder: true,
      stroke: 'yellow',
      strokeWidth: 3,
      fill:'transparent'
    });
    fabricCanvasActions.addObject(canvas_id, rect);    
  }

  _save(){
    this.props.fabricCanvasActions.toDataURL();    
  }
}

export default connect(null, mapDispatchToProps)(Toolbar);
