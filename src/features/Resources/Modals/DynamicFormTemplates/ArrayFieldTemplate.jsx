import React, { useState } from "react";
import { Card } from "@material-ui/core";
import { Button, Dropdown, Label } from "semantic-ui-react";
import { ArrayFieldTemplate as ArrayFieldTemplateRJSF } from "@rjsf/semantic-ui";
import XTagsSearch from '@ximdex/xui-react/material/XTags/XTagsSearch/XTagsSearch'
import { XTag } from '@ximdex/xui-react/material'

export default function ArrayFieldTemplate(props) {
    const [data] = useState(props.formData)
    return (

        <Card variant='outlined' className='forms-arrayField'>
            <label className='forms-arrayLabel'>{props.title}</label>
            {props.canAdd && (
                <Button
                    circular
                    icon='plus'
                    size='mini'
                    color='teal'
                    className='forms-btn-addArrayItem'
                    onClick={props.onAddClick}
                    disabled={props.formData.length > 0 && (props.formData.length >= 1 && props.formData[props.formData.length - 1] === undefined)}
                />
                )}
            <div className='forms-arrayContainer'>
                {props.schema.items.type === 'object' && !props.schema?.subType
                    ? ( <ArrayFieldTemplateRJSF {...props} canAdd={false}/>)
                    : (<CustomItem
                        array={data}
                        schema={props.schema}
                        formData={props.formData}
                        items={props.items}
                        props={props}
                    />)
                }
            </div>
        </Card>
  );
}

function CustomItem({schema, array, ...props}) {
    if (schema?.subType === 'dropdown') {
        return (
            <ArrayDropdown
                array={array}
                options={schema.options}
                formData={props.formData}
                items={props.items}
            />
        )
    }
    if (schema?.subType === 'xtags') {
        return (
            <ArrayXTags
                array={array}
                options={schema.options}
                formData={props.formData}
                items={props.items}
            />
        )

    }
    return ( <ListItems items={props.items}  props={props.props}/> )
}

function ArrayDropdown({array, options, formData, ...props}) {
    const [show, setShow] = useState(false);
    const [opts, setOpts] = useState({});

    const onDropdown = (options) => {
        if (opts?.id !== options.id) {
            setOpts(options)
        }
        if (!show) setShow(true)
    }

    const onChange = ({name, id}) => {
        opts?.onChange(name)
        resetState()
    }

    const resetState = () => {
        setOpts({id: -1, onChange: (data) => {}, popIndex: (index) => { return; }, indexToPop: -1})
        setShow(false)
    }

    const handleDelete = (evt) => {
        opts?.popIndex(opts?.indexToPop)(evt)
        resetState()
    }

    return (
        <>
            {show && (
                <div style={{display: 'flex', flexDirection:'row'}}>
                    <Dropdown
                        fluid
                        selection
                        selectOnBlur={false}
                    >
                        <Dropdown.Menu scrolling={true}>
                            {options.map(({name, id}) => (
                                <Dropdown.Item
                                    key={id} onClick={() => onChange({name, id})}
                                    disabled={array.some(item => item.toLowerCase().trim() === name.toLowerCase().trim())}
                                >{name}</Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button icon='close' size='mini' className={'forms-btn-removeArrayItem'} onClick={handleDelete} style={{height: 38}}/>
                </div>
            )}
            <ListItems items={props.items} handleAction={onDropdown} />
        </>

    )
}

const ListItems = ({items, handleAction, ...props}) => {

    const handleKeyDown = (event, data) => {
        if (event.key === "Enter") {
          event.preventDefault();
          data.props.onChange(event.target.value);
        }
    };

    return items.map(element => {
        const {children: data, onDropIndexClick: popIndex, index: indexToPop} = element

        if (handleAction && data.props.formData === undefined) {
            handleAction({onChange: data.props.onChange, id: data.props.idSchema.$id, popIndex, indexToPop})
            return null
        }
        return (
            <div key={element.key} className='forms-arrayItem'>
                <div className='forms-textField'>
                    {data.props.formData !== undefined && (<Label className='forms-currentItems' size='large'>{data.props.formData}</Label>)}
                    {!handleAction && data.props.formData === undefined && (
                        <input
                            className='forms-onArrayAddItem'
                            id={data.props.idSchema.$id}
                            type='text'
                            defaultValue={data.props.formData}
                            //onChange={(event) => data.props.onChange(event.target.value)}
                            onKeyDown={(event) => handleKeyDown(event, data)}
                        />
                    )}
                </div>
                <Button icon='close' size='mini' className={data.props.formData !== undefined ? 'forms-btn-removeArrayItem' : 'forms-btn-removeArrayItem f-editing'} onClick={popIndex(indexToPop)} />
            </div>
        )

    })
}

function ArrayXTags({array, options, formData, ...props}) {
    const [show, setShow] = useState(false);
    const [opts, setOpts] = useState({});

    const onSearch = (options) => {
        if (opts?.id !== options.id) {
            setOpts(options)
        }
        if (!show) setShow(true)
    }

    const onChange = ({vocabulary, id, label}) => {
        const newOption = {solr_languague: 'en', vocabulary, id, label }
        opts.onChange(newOption)
        resetState()
    }

    const resetState = () => {
        setOpts({})
        setShow(false)
    }

    const handleDelete = (evt) => {
        opts?.popIndex(opts?.indexToPop)(evt)
        resetState()
    }

    return (
        <>
            {show && (
                <div style={{display: 'flex', flexDirection:'row', alignItems: 'center', marginLeft: -10}}>
                    <XTagsSearch
                        label="Search tag"
                        size="medium"
                        xtagApiUrl={" http://xtagsv1.pre-cloud.ximdex.net/api/"}
                        language={'en'}
                        vocabularies={["skill_worldbank", "thesaurus"]}
                        addTag={onChange}
                        autocompleteProps={{
                            disableClearable: true
                        }}
                        style={{autocomplete: {border: 'none'}}}
                    />
                    <Button icon='close' size='mini' className={'forms-btn-removeArrayItem'} onClick={handleDelete} style={{height: 41}} />
                </div>
            )}
            <ListItemsXTags items={props.items} handleAction={onSearch} />
        </>
    )
}

function ListItemsXTags({items, handleAction, ...props}) {

    const onDelete = () => {

    }

    return items.map(element => {
        const {children: data, onDropIndexClick: popIndex, index: indexToPop} = element

        if (Object.keys(data.props.formData).length === 0) {
            handleAction({onChange: data.props.onChange, id: data.props.idSchema.$id, popIndex, indexToPop})
            return null
        }

        let tag ={...data.props.formData}
        tag.link = ''
        tag.description = ''
        tag.type = tag.vocabulary === 'thesauro' ? 'organization' : 'custom'

        return (
            <div key={element.key} className='forms-arrayItem'>
                <div className='forms-textField'>
                    <XTag
                        key={tag.id}
                        tag={tag}
                        onDelete={popIndex(indexToPop)}
                        // canEdit
                        canDelete
                        customizable={{
                            organization: {
                                color: '#43A1A2',
                            }
                        }}
                    />
                </div>
            </div>
        )

    })
}
