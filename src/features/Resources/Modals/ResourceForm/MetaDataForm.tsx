import React, { useContext, useEffect, useState } from "react";
import { Message } from "semantic-ui-react";
import ArrayFieldTemplate from "../DynamicFormTemplates/ArrayFieldTemplate";
import SemanticForm from "@rjsf/semantic-ui";
import { JSONSchema7 } from 'json-schema';
import { CustomToggle, CustomDropdown, CustomBookNumberOfUnitSelector, InputTextArea, CustomInputText, InputText } from "../DynamicFormTemplates/CustomFields";
import { RESOURCE_FORM_ACTION_DICTIONARY } from "../../../../constants";
import { ResourceFormContex } from "./ResourceFormContext";

const uiSchema = {

    "description": {
        "ui:order": ["active", "*"],
        "active": {
            "ui:widget": CustomToggle,
        },
        "course_source": {
            "ui:widget": CustomDropdown,
            "ui:options": {
                label: 'Course source'
            }
        },
        "unit": {
            "ui:widget": CustomBookNumberOfUnitSelector,
            "ui:options": {
                "max": 50
            }
        },
        "partials": {
            "pages": {
                "ui:widget": "hidden",
            }
        },
        "description": {
            "ui:widget": InputTextArea,
            "ui:options": {
                "rows": 5
            }
        },
        "name": {
            "ui:widget": CustomInputText,
        },
        "external_url": {
            "ui:widget": CustomInputText,
            "ui:options": {
                "title": 'External url'
            }
        },
    }
}

const customWidgets = {
    TextWidget: InputText,
};

const MetaDataForm = () => {
    const { state, dispatch } = useContext(ResourceFormContex);

    return (
        <ResourceFormContex.Provider value={{ state, dispatch }}>
            <div className='form-messages'>
                {state.displayMetaDataMessage && <FeedbackMessage /> }
            </div>
            <SemanticForm
                id='sfu'
                className={state.formMetaDataFilled ? 'fill-alert' : ''}
                uiSchema={uiSchema}
                schema={state.schema as JSONSchema7}
                formData={state.formMetaData}
                onChange={(form) => dispatch({ type: 'updateForm', payload: form.formData})}
                ArrayFieldTemplate={ArrayFieldTemplate}
                widgets={customWidgets}
            >
                <button ref={state._refForm} type="submit" style={{ display: "none" }} />
            </SemanticForm>
        </ResourceFormContex.Provider>
    )
};

const FeedbackMessage = () => {
    const { state, dispatch } = useContext(ResourceFormContex);
    const [completedAction] = useState(RESOURCE_FORM_ACTION_DICTIONARY[state.action]["en"].completed);

    return (
        <Message
            color={state.succes ? 'teal' : 'red'}
            className={state.displayMetaDataMessage ? 'zoom-message' : 'hidden-message'}
            info
            onDismiss={() => dispatch({ type: 'dismiss_meta_data_alert' })}>
            {
                state.succes ? (
                    <>
                        <Message.Header>Done</Message.Header>
                        <p>Resource {completedAction}</p>
                    </>
                ) :
                    (
                        <>
                            <Message.Header>An error ocurred</Message.Header>
                            <p>{state.message}</p>
                        </>
                    )
            }
        </Message>
    );
}

export default MetaDataForm;