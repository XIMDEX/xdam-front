import React from 'react'
import './Input.css';

function Input(props) {
    return (
        <input 
            value={props.value}
            onChange={props?.onChange}
            type='text'
            style={props?.style}
        />
    )
}

export default Input
