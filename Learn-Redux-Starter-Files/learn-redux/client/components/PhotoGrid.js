import React from 'react';
import {Link} from 'react-router';
import Image from './Image'

const PhotoGrid = React.createClass({
    render(){
        return(
            <div className="photo-grid">
                {this.props.posts.map((post, i) => <Image
                  {...this.props} key={i} i={i} post={post}/>)}
            </div>
        )
    }
});

export default PhotoGrid;