import React, { useState } from 'react'
import { checkValueExistInArray } from '../../services/utils'
import Suggestions from '../Suggestions/Suggestions'
import Taxon from '../Taxon/Taxon'

function Layout(props) {

    const [suggestions, setSuggestion] = useState([])

    let style = { }
    let customClass = '';

    const addSuggestions = (values) => {
        let newValues = [...suggestions]
        values.forEach(value => checkValueExistInArray(value, suggestions, 'id', 'id')
            ? null
            : newValues.push(value)
        ); 
        setSuggestion(newValues)
    }
    
    
    return (
            <div style={style}>  
                <Taxon {...props} addSuggestions={addSuggestions} />
                <Suggestions className={`suggestions ${customClass}`} suggestions={suggestions}/>
            </div>
            
    )
}

export default Layout
