import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';

class Buttons extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="d-flex flex-column justify-content-start">
          <RaisedButton className="mt-0" label="Clear" primary={true}/>
          <RaisedButton className="mt-2" label="Process" secondary={true}/>
          <Toggle     className="mt-3 toggle" label="Debug" onToggle={(e) => this.props.toggleDebug(e)}/>
        </div>
      </div>

    )
  }
}

export default Buttons;