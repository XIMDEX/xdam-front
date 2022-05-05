import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Button, Dropdown, Icon } from "semantic-ui-react";
import MainService from "../../../../api/service";
import { RESOURCE_FORM_ACTION_DICTIONARY } from "../../../../constants";
import { ResourceFormContex } from "./ResourceFormContext";
import { selectCollection } from '../../../../slices/organizationSlice';


const handleClick = (e, callback: () => void) => {
    e.preventDefault();

    callback();
}

enum LastActions {
    lastCreated = 'lastCreated',
    lastUpdated = 'lastUpdated'
};

const FormButtons = ({ save }) => {
    const { state, dispatch } = useContext(ResourceFormContex);
    const collectionId = useSelector(selectCollection);
    const action = RESOURCE_FORM_ACTION_DICTIONARY[state.action]["en"].action;

    const updateResourceFrom = async (lastAction: LastActions) => {

        dispatch({ type: 'begin_submit' });

        MainService().getLastResource(collectionId, lastAction)
            .then(resource => dispatch({ type: 'last_resource_loaded', payload: resource.data }))
            .catch(error => dispatch({ type: 'error', payload: error.message }))
            .finally(() => dispatch({ type: 'end_processing' }));
    }

    return (
        <div className='forms-main-btns'>
            <Button color='teal' icon='facebook' onClick={(e) => handleClick(e, save)} loading={state.processing}>
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
                    <Dropdown.Item onClick={() => updateResourceFrom(LastActions.lastCreated)}>
                        Last resource created
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => updateResourceFrom(LastActions.lastUpdated)}>
                        Last resource updated
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

        </div>
    )
}

export default FormButtons;