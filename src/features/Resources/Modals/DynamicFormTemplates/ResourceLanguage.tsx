import React from "react"
import { Dropdown } from "semantic-ui-react"

enum languages {
    en = "english",
    es = "castellano",
    ca = "catalan"
}

function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export const ResourceLanguage = (props) => {
    return (
        <div className='forms-textField'>
            <section>
                <label style={{ display: 'block', marginBottom: 9 }} htmlFor={props.id}>
                    {props.options.label} {props.required ? '*' : ''}
                </label>
                <Dropdown
                    placeholder={props.value && languages[props.value] ? capitalize(languages[props.value]) : "Language"}
                    fluid
                    selection
                    selectOnBlur={false}
                    value={languages[props.value]}
                >
                    <Dropdown.Menu>
                        {props.options.opt.map((option: string) => (
                            <Dropdown.Item 
                                key={option}
                                value={option}
                                onClick={(_, data) => props.onChange(data.value) }>
                                {capitalize(languages[option])}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </section>
        </div>
    )
}