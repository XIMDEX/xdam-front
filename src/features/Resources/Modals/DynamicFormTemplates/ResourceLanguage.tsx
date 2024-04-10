import React from "react"
import { Dropdown } from "semantic-ui-react"
import { bookLanguages } from "../../../../constants";

const styles = {
    dropdown: {
        textTransform: "capitalize"
    },
    item: {
        // textTransform: "capitalize"
    },
}

export const ResourceLanguage = (props) => {

    const handleClick = (value) => {
        props.onChange(value)
    };
    const enumLanguages = props.options.enum

    return (
        <div className='forms-textField'>
            <section>
                <label style={{ display: 'block', marginBottom: 9 }} htmlFor={props.id}>
                    {props.options.label} {props.required ? '*' : ''}
                </label>
                <Dropdown
                    placeholder={props.value && enumLanguages[props.value] ? enumLanguages[props.value] : "Language"}
                    fluid
                    selection
                    selectOnBlur={false}
                    value={enumLanguages[props.value]}
                    style={styles.dropdown}
                >
                    <Dropdown.Menu>
                        {props.options.opt.map((option: string) => (
                            <Dropdown.Item
                                key={option}
                                value={option}
                                style={styles.item}
                                onClick={(_, data) => handleClick(data.value)}>
                                {enumLanguages[option]}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </section>
        </div>
    )
}
