import React, { useState, useEffect } from 'react'
import { Button } from 'semantic-ui-react';
import MainService from '../../../../../../../api/service';
import IconTag from '../../../IconTag/IconTag'
import './Tag.css';

const { getTaxonDetails } = MainService();

export default function Tag({id, addSuggestions,...props}) {
    const [info, setInfo] = useState({
        scopeNote: ''
    })
    const [suggestions, setSuggestions] = useState([])

    useEffect(() => { 
        const handleInfo = async () => {
            const info = await getTaxonDetails(id)
            setInfo(info)
            if (info.suggestions.length > 0 ) setSuggestions((info.suggestions))
        }
        '' === id ? handleDelete() : handleInfo()
    }, [id])


    useEffect(() => { addSuggestions(suggestions) }, [suggestions])

    const [isEdit, setEdit] = useState(false);

    const handleEdition = () => setEdit(!isEdit)

    const handleDelete = props.popIndex(props.indexToPop)   

    return (
        <>
            <div className='tag' onClick={handleEdition} title={info.scopeNote !== '' ? info.scopeNote : ''}>
                <IconTag className='icon-tag' color='#2fb7a4' width={'32px'} type='custom'/>
                <div className='text' style={{}}>
                    <span className='label'>{props.label}</span>
                    <span className='description'>Thesauro - Unesco</span>
                </div>
                
                <Button id='delete'
                    icon={`${isEdit ? 'close' : null}`} 
                    size='small'
                    className={`delete-tag ${!isEdit && 'hidden'}` }
                    onClick={isEdit ? handleDelete : null} 
                />
            </div>
            {!isEdit && <div style={{width: 0}}></div>}
        </>
    )
}
