import React from "react";
import { bookLanguages } from "../../../constants";
import { ResourceLanguage } from "../../../features/Resources/Modals/DynamicFormTemplates/ResourceLanguage";
import styles from './ResourceLanguageWrapper.module.scss';

const ResourceLanguageWrapper = (
    { value='en', onChange, label = '', required = false }: { value: string, onChange: (value: string) => void, label?: string, required?: boolean }
) => {

    const widgetOptions = {
        label,
        opt: ["es", "ca", "en", "eu", "gl"],
        enum: bookLanguages
    }

    return(
        <div className={styles.resourceLanguageWrapper}>
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
