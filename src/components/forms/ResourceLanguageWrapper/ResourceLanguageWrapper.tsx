import React, { useContext } from "react";
import { bookLanguages } from "../../../constants";
import { ResourceLanguage } from "../../../features/Resources/Modals/DynamicFormTemplates/ResourceLanguage";
import RequiredValuesContext from "../../../features/Resources/Modals/MassiveUpload/RequiredValuesContext";
import styles from './ResourceLanguageWrapper.module.scss';

const ResourceLanguageWrapper = (
    { value, onChange, label = '', required = false }: { value: string, onChange: (value: string) => void, label?: string, required?: boolean }
) => {

    const requiredValues = useContext(RequiredValuesContext);

    const requiredAndEmpty = () => {
        return !value && requiredValues.conversionAfterUpload;
    }

    const widgetOptions = {
        label,
        opt: Object.keys(bookLanguages)
    }

    return(
        <div className={`${styles.resourceLanguageWrapper} ${requiredAndEmpty()? styles.error : ''}`}>
            <ResourceLanguage 
                value={value}
                options={widgetOptions}
                onChange={onChange}
                required={required}
            />
        </div>
    )
}

export default ResourceLanguageWrapper;