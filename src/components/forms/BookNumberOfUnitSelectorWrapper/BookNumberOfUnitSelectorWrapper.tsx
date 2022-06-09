import React, { useContext, useState } from "react"
import { Button, Icon } from "semantic-ui-react";
import { CustomBookNumberOfUnitSelector } from "../../../features/Resources/Modals/DynamicFormTemplates/CustomFields"
import RequiredValuesContext from "../../../features/Resources/Modals/MassiveUpload/RequiredValuesContext";
import styles from "./BookNumberOfUnitSelectorWrapper.module.scss";

const BookNumberOfUnitSelectorWrapper = ({ onChange, maxUnit, unavaliableValues }: { onChange: (value: number) => void, maxUnit?: number, unavaliableValues: number[] }) => {

    const [value, setValue] = useState<number>(null);
    const requiredValues = useContext(RequiredValuesContext);

    const isEmptyAndRequired = () => {
        return requiredValues.conversionAfterUpload && !value;
    }

    const unsetValue = () => {
        onChange(null);
        setValue(null);
    }

    const onChangeAsInt = (value: string) => {
        setValue(parseInt(value));
        onChange(parseInt(value));
    }

    return (
        <div className={`${styles.bookNumberOfUnitSelectorWrapper}  ${isEmptyAndRequired() ? styles.error : ''}`}>
            <div className={styles.bookNumberOfUnitSelectorWrapper__selector}>
                <CustomBookNumberOfUnitSelector value={value} onChange={onChangeAsInt} maxOptions={maxUnit} unavaliableValues={unavaliableValues} />
            </div>
            
            <Button icon onClick={unsetValue} className={styles.bookNumberOfUnitSelectorWrapper__unset}>
                <Icon name='close' />
            </Button>
        </div>
    )
}

export default BookNumberOfUnitSelectorWrapper;
