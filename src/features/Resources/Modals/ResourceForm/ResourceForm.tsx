import { DialogContent, DialogContentText, Grid } from "@material-ui/core";
import React, { useReducer } from "react";
import { useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import { ResourceType } from "../../../../constants";
import { selectCollection } from "../../../../slices/organizationSlice";
import FormButtons from "./FormButtons";
import MainDataForm from "./MainDataForm";
import { ResourceMetaDataForm, resourceFormInitalState, FormAction, FormContext } from "./ResourceFormContext";
import { submitResource } from "./submitResource";

function resourceFormReducer(state: FormContext, action: { type: string, payload?: any }) {

    switch (action.type) {
        case 'updateForm': {
            return {
                ...state,
                formMetaData: action.payload,
            }
        }
        case 'begin_submit': {
            return {
                ...state,
                displayMetaDataMessage: false,
                succes: true,
                processing: true,
            }
        }
        case 'finish_submit': {
            return {
                ...state,
                displayMetaDataMessage: true,
                processing: false,
                action: FormAction.UPDATE
            }
        }
        case 'succes': {
            localStorage.setItem('reload_catalogue', '1');
            return {
                ...state,
                succes: true,
                reload: true,
                formMetaData: action.payload.data,
                resourceId: action.payload.id
            }
        }
        case 'error': {
            return {
                ...state,
                displayMetaDataMessage: true,
                message: action.payload ?? 'Error 0',
                succes: false,
                processing: false
            }
        }
        case 'dismissMetaDataAlert': {
            return {
                ...state,
                displayMetaDataMessage: false,
                message: ''
            }
        }
        case 'loadLastCreated': {
            // const data = updateResourceFrom('lastCreated');
            // setForm(data);
            return {
                ...state,
            }
        }
        default:
            return state;
    }
}

const ResourceForm = (
    { resourceType, schema, dataForUpdate = null, handleClose }:
        { resourceType: ResourceType, schema: any, dataForUpdate?: any, handleClose: () => void }) => {

    const _refForm = React.useRef(null);
    const collectionId = useSelector(selectCollection);
    const [state, dispatch] = useReducer(
        resourceFormReducer,
        {
            ...resourceFormInitalState,
            action: dataForUpdate ? FormAction.UPDATE : FormAction.CREATE,
            _refForm,
            schema,
            resourceType,
            dataForUpdate,
            formMetaData: dataForUpdate?.data ?? {},
            resourceId: dataForUpdate?.id
        });


    const submit = async () => {
        dispatch({ type: 'begin_submit' });

        state._refForm.current.click();

        await submitResource(
            state.action,
            state.formMetaData,
            state.formFiles,
            state.previewImage,
            state.resourceType,
            state.resourceId,
            collectionId
        )
        .then(response => response.json())
        .then(resource => dispatch({ type: 'succes', payload: resource }))
        .catch(error => dispatch({ type: 'error', payload: error.message }))

        dispatch({ type: 'finish_submit'});
    }

    return (
        <ResourceMetaDataForm.Provider value={{ state, dispatch }}>
            <DialogContent className='edit-create-dialog-content'>
                <DialogContentText>
                    <Button color='teal' circular icon='close' onClick={() => handleClose()} className='read-card-close-button' />
                </DialogContentText>
                <Grid container spacing={2}>
                    <Grid item sm={12} id='form-content'>
                        <FormButtons save={submit} />
                        <MainDataForm />
                    </Grid>
                </Grid>
            </DialogContent>
        </ResourceMetaDataForm.Provider>
    );
}

export default ResourceForm;