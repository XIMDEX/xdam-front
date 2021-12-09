import React from 'react'

function IconTag({type, width, color, ...props}) {
    return ( 
        <div className={` ${props.className}`} style={{backgroundColor: color}}>
            <img src={`${type}_tag.png`} alt='' width={width}/>
        </div> )
}

export default IconTag
