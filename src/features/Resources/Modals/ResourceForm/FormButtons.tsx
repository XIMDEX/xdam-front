import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Button, Dropdown, Icon } from "semantic-ui-react";
import MainService from "../../../../api/service";
import { RESOURCE_FORM_ACTION_DICTIONARY } from "../../../../constants";
import { ResourceFormContex, FormAction } from "./ResourceFormContext";
import { selectCollection } from '../../../../slices/organizationSlice';
import { submitResource } from "./submitResource";

enum metaDataFormActions {
    lastCreated = 'lastCreated',
    lastUpdated = 'lastUpdated'
};

const buttonsWrapperStyles = {
    paddingRight: "25px"
}

const FormButtons = ({sync}) => {
    const collectionId = useSelector(selectCollection);
    const { state, dispatch } = useContext(ResourceFormContex);
    const action = RESOURCE_FORM_ACTION_DICTIONARY[state.action]["en"].action;

    const submit = async () => {
        dispatch({ type: 'begin_submit' });

        state._refForm.current.click();

        await submitResource(
            state.action,
            state.formMetaData,
            state.files,
            state.previewImage,
            state.resourceType,
            state.resourceId,
            collectionId
        )
            .then(response => response.json())
            .then(resource => dispatch({ type: 'succes', payload: resource }))
            .catch(error => dispatch({ type: 'error', payload: error.message }))

        dispatch({ type: 'finish_submit' });
        dispatch({ type: 'change_action', payload: FormAction.UPDATE });

        sync(Date.now());
    }

    const updateResourceFrom = async (action: metaDataFormActions) => {

        dispatch({ type: 'begin_submit' });

        MainService().getLastResource(collectionId, action)
            .then(resource => {
                dispatch({ type: 'last_resource_loaded', payload: resource.data });
            })
            .catch(error => dispatch({ type: 'error', payload: error.message }))
            .finally(() => dispatch({ type: 'end_processing' }));
    }

    return (
        <div className='forms-main-btns' style={buttonsWrapperStyles}>
            <Button color='teal' icon='facebook' onClick={() => submit()} loading={state.processing}>
                <Icon name='save' /> {action}
            </Button>

            <Dropdown
                text='Import data'
                icon='clone'
                color='teal'
                labeled
                button
                className='icon teal'
            >
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => updateResourceFrom(metaDataFormActions.lastCreated)}>
                        Last resource created
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => updateResourceFrom(metaDataFormActions.lastUpdated)}>
                        Last resource updated
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

        </div>
    )
}

export default FormButtons;