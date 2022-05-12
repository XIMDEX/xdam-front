import React from "react"
import { Dropdown } from "semantic-ui-react"

enum languages {
    en = "english",
    es = "castellano",
    cat = "català"
}

export const ResourceLanguage = (props) => {
    console.log(props.options.opt)
    return (
        <div className={`forms-textField`}>
            <section>
                <label style={{ display: 'block', marginBottom: 9 }} htmlFor={props.id}>{props.label} {props.required ? '*' : ''}</label>
                <Dropdown
                    placeholder={"Language"}
                    fluid
                    selection
                    selectOnBlur={false}
                >
                    <Dropdown.Menu>
                        {props.options.opt.map((option, index) => (
                            <Dropdown.Item 
                                key={option}
                                value={option}
                                onClick={(_, data) => { console.log(data); props.onChange(data.value) }}>
                                {languages[option]}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </section>
        </div>
    )
}