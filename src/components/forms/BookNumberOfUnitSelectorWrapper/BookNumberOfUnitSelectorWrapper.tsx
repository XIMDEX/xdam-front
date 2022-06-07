import React from "react"
import { Button, Icon } from "semantic-ui-react";
import { CustomBookNumberOfUnitSelector } from "../../../features/Resources/Modals/DynamicFormTemplates/CustomFields"
import styles from "./BookNumberOfUnitSelectorWrapper.module.scss";

const BookNumberOfUnitSelectorWrapper = ({ value, onChange, maxUnit, unavaliableValues }: { value: number, onChange: (children: any) => void, maxUnit?: number, unavaliableValues: number[] }) => {

    const unsetValue = () => {
        onChange(null);
    }

    return (
        <div className={styles.bookNumberOfUnitSelectorWrapper}>
            <div className={styles.bookNumberOfUnitSelectorWrapper__selector}>
                <CustomBookNumberOfUnitSelector value={value} onChange={onChange} maxOptions={maxUnit} unavaliableValues={unavaliableValues} />
            </div>
            
            <Button icon onClick={unsetValue} className={styles.bookNumberOfUnitSelectorWrapper__unset}>
                <Icon name='close' />
            </Button>
        </div>
    )
}

export default BookNumberOfUnitSelectorWrapper;
