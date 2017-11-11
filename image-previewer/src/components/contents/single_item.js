import React from 'react';
import Photo from './image';
import Buttons from './controllers';
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

  toggleDebug(){
    this.setState({
      debug: !this.state.debug
    })
  }
  
  render() {
    const image = this.props.img.preview;
    return (
      <div className={this.state.debug ? "container-fluid" : "container"}>
        <li className="list-group-item">
          <div className="d-flex">
            <div className="col-2">
              <Buttons id="controllers" toggleDebug={this.toggleDebug}/>
            </div>
            <div className="col-10">
              <div className="d-flex flex-row justify-content-between">
                <Photo img={image} caption={"Original Image"} className='p-2'/>
                {this.state.debug ?<Photo img={image} caption={"Debug"}/>: null}
                <Photo img={image} caption={"Generated Image"}  className='p-2'/>
              </div>
            </div>
          </div>

          <div className="hover-btn">
            <FloatingActionButton
              mini={true}
              onClick={() => this.props.removeItem(this.props.id)}>
              <RemoveCircle/>
            </FloatingActionButton>
          </div>
        </li>
      </div>

    )
  }
}

export default SingleView;