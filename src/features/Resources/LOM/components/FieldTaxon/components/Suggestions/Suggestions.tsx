import React from 'react'

function Suggestions(props) {
    return (
        <div className={`${props.className} suggestion-wrap`}>
            {props.suggestions.map(e => (
                <span className='suggestion-unit'>{e.name}</span>
            ))}
        </div>
    )
}

export default Suggestions
