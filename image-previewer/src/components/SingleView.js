import React from 'react';
import Photo from './Photo';
import Toolbar from './ToolBar';

// Material UI design icons
import FloatingActionButton from 'material-ui/FloatingActionButton';
import RemoveCircle from 'material-ui/svg-icons/content/clear';


class SingleView extends React.Component {
  /*
  * This view is reponsible for updating all posible states of its children:
        *Generated toolbars and image views
        * Update canvas view if there is an event triggered
  */
  constructor(props){
    super(props);
    this.isDebugging = false;
    this.toggleDebug = this.toggleDebug.bind(this);
  }
  render() {
    let {image, id, deleteImage,...props} = this.props;    
    return (
      <div className={this.isDebugging? "" : "container"}> {/* to expand the view */}
        <li className="d-flex list-group-item">
            <div className="align-self-start col-2">
              <Toolbar id="toolbar" toggleDebug={this.toggleDebug} actions={this.props.fabricCanvasActions} canvas_id={id}/>
            </div>
            {console.log("in single view")}
            <div className="col-10">
              <div className="d-flex flex-row justify-content-between">
                {/* Render Images (orginal, mask for debugging, result) */}
                <div className="p-2"><Photo id={id}  background={image.original}  caption={"Original Image"} {...props}/> </div>
                <div className="p-2"><Photo id={`generated-${id}`} background={image.generated} caption={"Generated Image"}  {...props}/> </div>
                {this.isDebugging
                  ? <div className="p-2"><Photo id={`debug-${id}`}  src={image.debug} caption={"Debug"}  {...props}/></div>
                  : null}
              </div>
            </div>
          <div className="hover-btn">
            <FloatingActionButton mini={true} onClick={() => deleteImage(id)}>
              <RemoveCircle/>
            </FloatingActionButton>
          </div>
        </li>
      </div>
    )
  }

  toggleDebug(){
    this.isDebugging = !this.isDebugging;
  }
}

export default SingleView;