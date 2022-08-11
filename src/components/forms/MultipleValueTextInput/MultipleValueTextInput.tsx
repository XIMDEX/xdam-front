import React, { useState } from "react";
import { Button, Input } from "semantic-ui-react";

import styles from "./MultipleValueTextInput.module.scss";

const MultipleValueTextInput = ({name, setData}: {name?: string, setData: (value: any) => void}) => {

    const [values, setValues] = useState<string[]>([]);

    let addField = () => {
        setValues([...values, ""]);
    }

    let removeField = (event, index) => {
        event.preventDefault();

        const newFormValues = [...values];
        newFormValues.splice(index, 1);
        
        setValues(newFormValues);
    }

    const updateValue = (index: number, newValue: string) => {
        const valuesToUpdate = [...values];

        valuesToUpdate[index] = newValue;

        setValues(valuesToUpdate);
        setData(valuesToUpdate);
    }

    return(
        <div className={styles.multipleValueTextInput}>
            <div className={styles.multipleValueTextInput__header}>
                <span className={styles.multipleValueTextInput__label}>{name}</span>
                <Button circular icon='plus' onClick={addField} color='teal' size='tiny'/>
            </div>
            {values.map((_item, index) => (
                <div key={index}>
                    <Input 
                        size='massive'
                        action={{
                            icon: 'close',
                            onClick: (event) => removeField(event, index),
                        }}
                        onChange={(e) => updateValue(index, e.target.value)}
                        className={styles.multipleValueTextInput__input}
                    />
                </div>
            ))}
        </div>
    )
}

export default MultipleValueTextInput;