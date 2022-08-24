import React, { useState } from 'react'
import './Input.css';

function Input(props) {
    const [isHover, setIsHover] = useState(false);

    const handleHover = (value) => setIsHover(value) 

    return (
        <input 
            type='text'
            style={!isHover ? props?.style : {...props?.style, ...props?.onHoverStyle }}
            onMouseEnter={()=> handleHover(true)}
            onMouseLeave={()=> handleHover(false)}
            {...props}
        />
    )
}

export default Input
