import React from 'react';
import { Dropdown, Radio } from "semantic-ui-react"
import { MAX_BOOK_UNITS } from '../../../../constants';

export const InputText = (props) => {
    return (
        <div className='forms-textField'>
            <section>
                <label htmlFor={props.id}>{props.label}</label>
                <input id={props.id} type='text' defaultValue={props.value} onChange={(event) => props.onChange(event.target.value)}/>
            </section>
        </div>
    )
}

const clickForOutline = (e) => {
    const target = e.target as HTMLTextAreaElement;
    target.click(); 
    e.stopPropagation();
}

export const InputTextArea = (props) => {
    return (
        <div className={`forms-textField`}>
            <section>
                <label htmlFor={props.id}>{props.label} {props.required ? '*' : ''}</label>
                <textarea 
                    id={props.id} 
                    defaultValue={props.value} 
                    onClick={clickForOutline} 
                    onChange={(event) => props.onChange(event.target.value)}
                    rows={4}
                />
            </section>
        </div>
    )
}

export const CustomToggle = (props) => {

    return (
        <div className={`forms-textField`}>
            <section>
                <label style={{display: 'block', marginBottom: 9}} htmlFor={props.id}>{props.label} {props.required ? '*' : ''}</label>
                <Radio 
                    toggle 
                    onClick={(_, data) => {props.onChange(data.checked)}}
                    checked={props.value || false}
                    />
            </section>
        </div>
    )
}

export const CustomInputText = (props) => {
    return (
        <div className={`forms-textField`}>
            <section>
                <label htmlFor={props.id}>{props.label} {props.required ? '*' : ''}</label>
                <input id={props.id} defaultValue={props.value} onChange={(event) => props.onChange(event.target.value)}/>
            </section>
        </div>
    )
}

export const CustomDropdown = (props) => {
    return (
        <div className={`forms-textField `}>
            <section>
                <label htmlFor={props.id}>{props.label} {props.required ? '*' : ''}</label>
                <Dropdown 
                    placeholder={props.value}
                    fluid
                    selection
                    selectOnBlur={false}
                    >
                    <Dropdown.Menu>
                    {props.options.enumOptions.map(e => (
                        <Dropdown.Item onClick={(event, data) => {props.onChange(data.children)}}>{e.value}</Dropdown.Item>
                    ))}
                    </Dropdown.Menu>
                </Dropdown>
            </section>
        </div>
    )
}

export const CustomBookNumberOfUnitSelector = (props) => {

    const maxUnits = (props.maxOptions || MAX_BOOK_UNITS) + 1;

    const formatUnits = (number: number) => {

        if(!number) return;

        return number.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
        })
    }

    return (
        <div className={`forms-textField `}>
            <label htmlFor={props.id}>{props.label} {props.required ? '*' : ''}</label>
            <Dropdown 
                fluid
                selection
                selectOnBlur={false}
                placeholder={formatUnits(props.value)  || "Introduce the book units"}
                value={formatUnits(props.value)}
                >
                <Dropdown.Menu>
                {    Array.from(Array(maxUnits).keys()).map((i, _) => (
                        <Dropdown.Item onClick={(event, data) => {props.onChange(data.children)}} value={i}>
                            {formatUnits(i)}
                        </Dropdown.Item>
                    ))
                }
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}