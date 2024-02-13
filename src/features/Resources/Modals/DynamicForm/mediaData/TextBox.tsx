import React from 'react';
const TextBox = ({text,title,...props}) => {
    return(
        <div style={{"borderTop":"2px solid #eaeaea","padding":"4px","overflow":"scroll","maxHeight":"100px"}}>
            <label style={{"fontWeight":"bold"}}>{title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()}</label>
            <p>{text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()}</p>
        </div>
    )
}

export default TextBox;