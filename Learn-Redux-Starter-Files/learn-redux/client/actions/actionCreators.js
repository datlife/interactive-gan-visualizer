// Upload Image
// Select Object
// Drag Object

export function upload(image){
    return {
        type: 'UPLOAD_IMAGE',
        image
    }
}
export function increment(index){
    return {
        type: 'INCREMENT_LIKES',
        index
    }
}

// Select Object
export function addComent(postID, author, comment){
    return {
        type: 'ADD_COMMENT',
        postID,
        author,
        comment
    }
}
