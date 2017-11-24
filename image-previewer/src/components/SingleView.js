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
  render() {
    let {image, bboxes, views, id, ...props} = this.props;    
    let {ImageHandler} = this.props;

    return (
      <div className={image.isDebugging? "true" : "container"}> {/* to expand the view */}

        <li className="d-flex list-group-item">

          <div className="align-self-start col-2">
            <Toolbar canvas_id={id} {...props} isDebugging={image.isDebugging}/>
          </div>

          <div className="col-10">
            <div className="d-flex flex-row justify-content-between">

              <div className="p-2"><Photo 
                                      id={id}
                                      background={image.original}  
                                      fabricCanvas={views.byId[id]}
                                      caption={"Original Image"} {...props}/> </div>

              <div className="p-2"><Photo 
                                      id={`generated-${id}`} 
                                      background={image.generated} 
                                      fabricCanvas={views.byId[`generated-${id}`]}
                                      caption={"Generated Image"}  {...props}/> </div>
              {image.isDebugging
                ? <div className="p-2"><Photo 
                                          id={`debug-${id}`}  
                                          background={image.debug} 
                                          fabricCanvas={views.byId[`debug-${id}`]}
                                          caption={"Debug Image"}  {...props}/></div>
                : null}
            </div>
          </div>

          <div className="hover-btn">
            <FloatingActionButton mini={true} onClick={() => ImageHandler.deleteImage(id)}>
              <RemoveCircle/>
            </FloatingActionButton>

          </div>
        </li>
      </div>
    )
  }
}

export default SingleView;