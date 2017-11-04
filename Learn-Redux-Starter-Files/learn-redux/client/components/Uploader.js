import React from 'react';

const Uploader = React.createClass({
    render(){
        return(
            <div className="form-group">
                <label  className="custom-file">
                <input type="file" id="file" class="custom-file-input"/>
                </label>
                <button className="btn btn-primary"
                        onClick={}>
                    Upload
                </button>
            </div>
        )
    }
});
export default Uploader;