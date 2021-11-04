import React, { useEffect, useState } from 'react'

import './Dropdown.css'

import Input from '../Input/Input'
import useSearch from '../../hooks/useSearch';
import { Button } from 'semantic-ui-react';
import getDetailInfo from '../../services/thesauro/getInfoDetail';
let selectStyle = {width: '100%', overflow: 'auto' }

function Dropdown(props) {
    const [opts, isLoading, txt, setTxt] = useSearch();
    const [id, setId] = useState(-1)
    const [selectable, setSelectable] = useState(true);


    useEffect(() => { 
        const handleInfo = async () => {
            const info = await getDetailInfo(id)
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
            setTxt(value)
        } else {
            evt.preventDefault();
        }
    }

    const onChange = (opt) => evt => {
        props.data.props.onChange({Id: opt.id, Entry: opt.tag_name})
        props.handleData({Id: opt.id, Entry: opt.tag_name})
        setTxt(opt.tag_name)
        setId(opt.id)
        setSelectable(false)
    }

    if (opts.length === 1) selectStyle = {...selectStyle, ...{padding: '10px 0', fontSize: 16}}

    return (
        <div style={{display: 'flex', flexDirection:'row', width: '100%'}}>
            <div style={{width: '90%', marginTop:3}} >

                <Input onChange={onChangeTxt} value={txt}/>            
                {selectable && opts.length > 0 && (
                    <select 
                        style={selectStyle} 
                        size={opts.length > 5 ? 5 : opts.length} name='select'
                    >
                        {opts.map((opt, i) => (
                            <option 
                                key={i} 
                                value={opt.id} 
                                style={{padding: '10px 0', fontSize: 16}}
                                onClick={onChange(opt)}
                            >
                                {opt.tag_name}
                            </option>
                        ))}
                    </select>
                )}
            </div>
            {!selectable && (
                <Button 
                    icon='close' 
                    size='mini' 
                    color='teal'
                    circular
                    className='forms-btn-removeArrayItem'
                    onClick={props.popIndex(props.indexToPop)} 
                    style={{marginTop: 3}}
                />
            )}
        </div>
    )
}

export default Dropdown
