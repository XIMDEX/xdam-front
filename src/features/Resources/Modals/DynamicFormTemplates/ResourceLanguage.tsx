import React from "react"
import { Dropdown } from "semantic-ui-react"
import { bookLanguages } from "../../../../constants";

const styles = {
    dropdown: {
        textTransform: "capitalize"
    },
    item: {
        textTransform: "capitalize"
    },
}

export const ResourceLanguage = (props) => {

    const handleClick = (value) => props.onChange(value);

    return (
        <div className='forms-textField'>
            <section>
                {props.options.label &&
                    <label style={{ display: 'block', marginBottom: 9 }} htmlFor={props.id}>
                        {props.options.label} {props.required ? '*' : ''}
                    </label>
                }
                <Dropdown
                    placeholder={props.value && bookLanguages[props.value] ? bookLanguages[props.value] : "Language"}
                    fluid
                    selection
                    selectOnBlur={false}
                    value={bookLanguages[props.value]}
                    style={styles.dropdown}
                >
                    <Dropdown.Menu>
                        {props.options.opt.map((option: string) => (
                            <Dropdown.Item 
                                key={option}
                                value={option}
                                style={styles.item}
                                onClick={(_, data) => handleClick(data.value)}>
                                {bookLanguages[option]}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </section>
        </div>
    )
}