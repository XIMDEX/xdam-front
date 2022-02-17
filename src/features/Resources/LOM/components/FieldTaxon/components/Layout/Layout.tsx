import React, { useEffect, useState } from 'react'
import { NUM_SUGGESTIONS } from '../../../../../../../constants'
import { checkValueExistInArray } from '../../services/utils'
import Suggestions from '../Suggestions/Suggestions'
import Taxon from '../Taxon/Taxon'

function Layout(props) {

    const [suggestions, setSuggestion] = useState([])
    const [data, setData] = useState(props.formData)

    let customClass = '';

    const addSuggestions = (values) => {
        let newValues = []
        values.forEach(value => !ifExists(value) ? newValues.push(value) : null );
        newValues.sort(()=> Math.random() - 0.5)
        setSuggestion([...suggestions, ...newValues])
    }

    const removeSuggestion = value => {
        let newSuggestions = suggestions.filter(suggestion => suggestion.id !== value.id && suggestion.id !== value['Id'])
        setSuggestion(newSuggestions)
    }
    
    const handleData = value => {
        setData([...data, value])
    }

    const ifExists = value => {
        if (checkValueExistInArray(value, suggestions, 'id', 'id')){
             return true;}
        if (checkIfExists(value)) {
            return true
        }
        return false;
    }


    const checkIfExists = value => {
        return checkValueExistInArray(value, data, 'id', 'Id')
    }
    
    return (
            <>  
                <Taxon 
                    {...props} 
                    addSuggestions={addSuggestions} 
                    data={data} 
                    handleData={handleData} 
                    checkIfExists={checkIfExists}
                />
                {suggestions.length > 0 && (
                    <Suggestions 
                        formData={props.formData}
                        className={`suggestions ${customClass}`} 
                        suggestions={suggestions} 
                        checkIfExists={checkIfExists} 
                        items={props.items} 
                        handleAddTaxon={props.onAddClick}
                        handleData={handleData}
                        removeSuggestion={removeSuggestion}
                        numSuggestions={NUM_SUGGESTIONS}
                    />)
                }
            </>
            
    )
}

export default Layout
