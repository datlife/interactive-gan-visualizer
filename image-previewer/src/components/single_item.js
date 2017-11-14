import React from 'react';
import Photo from './image';
import Toolbar from './ToolBar';

// Material UI design icons
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RemoveCircle from 'material-ui/svg-icons/content/clear';


class SingleView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debug: false
    }
    this.toggleDebug = this.toggleDebug.bind(this);
  }

  render() {
    const image = this.props.img.preview;
    return (
      <div className={this.state.debug? "" : "container-fluid"}>
        <li className="d-flex list-group-item">
            <div className="align-self-start col-2">
              <Toolbar id="toolbar" toggleDebug={this.toggleDebug}/>
            </div>

            <div className="col-10">
              <div className="d-flex flex-row justify-content-between">
                {/* Render Images (orginal, mask for debugging, result) */}
                <div className="p-2"><Photo img={this.props.img} caption={"Original Image"}/></div>
                {this.state.debug 
                  ? <div className="p-2"><Photo img={image} caption={"Debug"}/></div>
                  : null}
                <div className="p-2"><Photo img={image} caption={"Generated Image"}/></div>
              </div>

            </div>

          {/* Remove button - only appear when hovering on the item */}
          <div className="hover-btn">
            <FloatingActionButton mini={true} 
                                  onClick={() => this.props.removeItem(this.props.id)}>
              <RemoveCircle/>
            </FloatingActionButton>
          </div>
        </li>
      </div>
    )
  }
  
  toggleDebug(){
    this.setState({debug: !this.state.debug});
  }
  
}

export default SingleView;