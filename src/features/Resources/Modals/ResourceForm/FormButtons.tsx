import React, { useContext } from "react";
import { Button, Dropdown, Icon } from "semantic-ui-react";
import { RESOURCE_FORM_ACTION_DICTIONARY } from "../../../../constants";
import { ResourceMetaDataForm } from "./ResourceFormContext";

const handleClick = (e, callback: () => void) => {
    e.preventDefault();

    callback();
}

const FormButtons = ({ save }) => {
    const { state, dispatch } = useContext(ResourceMetaDataForm);
    const action = RESOURCE_FORM_ACTION_DICTIONARY[state.action]["en"].action;

    return (
        <div className='forms-main-btns'>
            <Button color='teal' icon='facebook' onClick={(e) => handleClick(e, save)} loading={state.processing}>
                <Icon name='save' /> { action }
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
                    <Dropdown.Item onClick={() => dispatch('loadLastCreated')}>
                        Last resource created
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => dispatch('loadLastUpdated')}>
                        Last resource updated
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

        </div>
    )
}

export default FormButtons;