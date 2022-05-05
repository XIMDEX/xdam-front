import { DialogContent, DialogContentText, Grid } from "@material-ui/core";
import React, { useEffect, useReducer, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "semantic-ui-react";
import MainService from "../../../../api/service";
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
                processing: false
            }
        }
        case 'end_processing': {
            return {
                ...state,
                processing: false
            }
        }
        case 'change_action': {
            return {
                ...state,
                action: action.payload
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
        case 'dismiss_meta_data_alert': {
            return {
                ...state,
                displayMetaDataMessage: false,
                message: ''
            }
        }
        case 'file_removed': {
            return {
                ...state,
                files: state.files.filter(file => file[action.payload.filterBy] !== action.payload.value)
            }
        }
        case 'files_attached': {
            return {
                ...state,
                files: [...state.files, ...action.payload ? action.payload : []]
            }
        }
        case 'resource_retrived': {
            return {
                ...state,
                files: action.payload
            }
        }
        case 'preview_changed': {
            return {
                ...state,
                previewImage: action.payload
            }
        }
        case 'last_resource_loaded': {
            return {
                ...state,
                formMetaData: action.payload,
                formMetaDataFilled: true
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
    const [lastSync, setLastSync] = useState(Date.now());
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

    useEffect(() => {
        async function fetchFiles() {
            const resource = await MainService().getResource(state.resourceId);
            dispatch({ type: 'resource_retrived', payload: resource.files });
        }

        if (state.resourceId) {
            fetchFiles();
        }
    }, [lastSync]);

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

        dispatch({ type: 'finish_submit'});
        dispatch({ type: 'change_action', payload: FormAction.UPDATE});

        setLastSync(Date.now());
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