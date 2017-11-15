import React from 'react';
import Photo from './image';
import Toolbar from './ToolBar';

// Material UI design icons
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RemoveCircle from 'material-ui/svg-icons/content/clear';


class SingleView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {debug: false};
  }

  render() {
    let {deleteImage, id, ...props} = this.props;
    return (
      <div className={this.state.debug? "" : "container"}>
        <li className="d-flex list-group-item">
            <div className="align-self-start col-2">
              <Toolbar id="toolbar" 
                        toggleDebug={this.toggleDebug.bind(this)}/>
            </div>

            <div className="col-10">
              <div className="d-flex flex-row justify-content-between">
                {/* Render Images (orginal, mask for debugging, result) */}
                <div className="p-2"><Photo id={`original-${id}`} caption={"Original Image"} {...props}/> </div>
                <div className="p-2"><Photo id={`generated-${id}`} caption={"Generated Image"}{...props}/> </div>
                {this.state.debug 
                  ? <div className="p-2"><Photo id={`debug-${id}`} caption={"Debug"} {...props}/></div>
                  : null}
              </div>
            </div>

          {/* Remove button - only appear when hovering on the item */}
          <div className="hover-btn">
            <FloatingActionButton mini={true} 
                                  onClick={() => deleteImage(id)}>
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