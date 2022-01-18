import React, { useEffect, useState } from 'react'
import Input from '../Input/Input'
import useSearch from '../../hooks/useSearch';
import { Button } from 'semantic-ui-react';
import MainService from '../../../../../api/service';

import './EditField.css'


const { getTaxonDetails } = MainService();

let selectStyle = {width: '100%', overflow: 'auto' }

function EditField(props) {
    const [name, setName] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [uri, setUri] = useState('');
    const [id, setId] = useState(-1)
    const [selectable, setSelectable] = useState(true);


    useEffect(() => { 
        const handleInfo = async () => {
            const info = await getTaxonDetails(id)
            setId(-1)
            if (info.suggestions.length > 0 ) props.addSuggestions(info.suggestions)
        }
        if (id !== -1) {
            handleInfo()
        }
    }, [id, props.addSuggestions])


    const onChangeTxt = (evt) => {
        if (selectable) {
            const value = evt.nativeEvent.target.value    
            setName(value)
        } else {
            evt.preventDefault();
        }
    }

    const onChange = (opt) => evt => {
        let option = {Id: opt.id, Entry: opt.tag_name};
        if (props.handleIfExists(option)) {
            props.popIndex(props.indexToPop)
            setName('')
            setSelectable(false)
        } else {
            props.data.props.onChange(option)
            props.handleData(option)
            setName(opt.tag_name)
            setId(opt.id)
            setSelectable(false)
        }
    }

    return selectable ? (
        <div style={{display: 'flex', flexDirection:'row', width: '100%'}}>
            <div style={{width: '90%', marginTop:3}} >
                <Input onChange={onChangeTxt} value={name}/>
            </div>
        </div>
    ) : null
}

export default EditField
