// Fabric part
var fabricCanvas = new fabric.Canvas();

// class which takes care about instantiating fabric and passing state to
// component with actual canvas
const FabricCanvas = React.createClass({
  componentDidMount() {
    // we need to get canvas element by ref to initialize fabric
    var el = this.refs.canvasContainer.refs.objectsCanvas;
    fabricCanvas.initialize(el, {
      height: 400,
      width: 400
    });
    // initial call to load objects in store and render canvas
    this.refs.canvasContainer.loadAndRender();

    fabricCanvas.on('mouse:up', () => {
      store.dispatch({
        type: 'OBJECTS_CANVAS_CHANGE',
        payload: {
          // send complete fabric canvas object to store
          canvasObject: fabricCanvas.toObject(),
          // also keep lastly active (selected) object
          selectedObject: fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject())
        }
      });
      this.refs.canvasContainer.loadAndRender();
    });
  },
  render: function () {
    return (
      <div>
        {/* send store and fabricInstance viac refs (maybe not the cleanest way, but I was not able to create global instance of fabric due to use of ES6 modules) */}
        <CanvasContainer
          ref="canvasContainer"
          canvasObjectState={this.props.objects}
          fabricInstance={fabricCanvas}/>
      </div>
    )
  }
});
const mapStateToProps = function (store) {
  return {objects: store.canvasObjectState};
};

// we can not use export default on jsfiddle so we need react class with mapped
// state in separate constant
const FabricCanvasReduxed = ReactRedux.connect(mapStateToProps)(FabricCanvas);

const CanvasContainer = React.createClass({
  loadAndRender: function () {
    var fabricCanvas = this.props.fabricInstance;
    fabricCanvas.loadFromJSON(this.props.canvasObjectState.canvasObject);
    fabricCanvas.renderAll();

    // if there is any previously active object, we need to re-set it after
    // rendering canvas
    var selectedObject = this.props.canvasObjectState.selectedObject;
    if (selectedObject > -1) {
      fabricCanvas.setActiveObject(fabricCanvas.getObjects()[this.props.canvasObjectState.selectedObject]);
    }

  },
  render: function () {
    this.loadAndRender();
    return (
      <canvas ref="objectsCanvas">)