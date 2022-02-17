import React, { useEffect, useState } from 'react'
import { Button } from 'semantic-ui-react';
import IconTag from '../../../IconTag/IconTag'
import './Suggestion.css'

function Suggestions({items, handleData, removeSuggestion, numSuggestions, suggestions,  ...props}) {
    const [itemsKeys, setItemsKeys] = useState(undefined);
    const [itemsIds, setItemsIds] = useState(undefined);
    const [newTaxon, setNewTaxon] = useState(undefined);
    const [newItem, setNewItem] = useState(undefined);
    const [suggestionsToShow, setSuggestions] = useState([]);
    const [showMore, setShowMore] = useState(false)

    useEffect(()=> {
        let keys = items.map(item => item.key)
        let ids = items.map(item => item.children.props.formData.Id)
        setItemsKeys(keys);
        setItemsIds(ids);
    },[items])

    useEffect(()=> {
        let _suggestions = suggestions.slice(0, numSuggestions);
        setSuggestions(_suggestions);
    },[suggestions, numSuggestions])

    useEffect(()=> {
        if (itemsKeys && itemsKeys.length !== items.length && newTaxon) {
            let new_item = items.filter(item => !itemsKeys.includes(item.key))
            setNewItem(new_item?.[0].key)
        }
    },[itemsKeys, items])
    
    useEffect(()=> {
        if (newTaxon?.id && newTaxon?.name && newItem) {
            let data = {'Id': newTaxon.id, 'Entry': newTaxon.name}
            let new_item = items.filter(item => item.key === newItem)

            new_item?.[0]?.children?.props?.onChange?.(data)
            handleData(data);
            removeSuggestion(data);
            resetState();
        }
    },[newItem, items, handleData, removeSuggestion])
    
    const handleAddSuggestion = (element, evt) => {
        const {handleAddTaxon} = props
        handleAddTaxon(evt);
        setNewTaxon(element);
    }

    const resetState = () => {
        setNewTaxon(undefined);
        setNewItem(undefined);
        setItemsKeys(items.map(item => item.key));
    }
    
    const toggleShowMore = () => setShowMore(!showMore)

    const showSuggestions = showMore ? suggestions : suggestionsToShow;

    return (
        <div>
            <h4 >Suggestions</h4>
            <div className={`${props.className} suggestion-wrap`}>
                {showSuggestions.map(e => (
                    <div key={e.id} className='suggestion-unit' onClick={(evt) => handleAddSuggestion(e, evt)}>
                        <IconTag className='suggestion-icon' type='custom' color='#2fb7a4' width='16px'/>
                        <span>{e.name}</span>
                    </div>
                ))}
            </div>
            {suggestions.length > numSuggestions  && (
                <div className='suggestions-more'><span onClick={toggleShowMore}>Show {showMore ? 'less' : 'more'}</span></div>
            )}
        </div>
    )
}
export interface ISignUpData {
    firstName: string;
    emailAddress: string;
}

export default Suggestions
