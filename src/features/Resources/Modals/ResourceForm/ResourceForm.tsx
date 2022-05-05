import { DialogContent, DialogContentText, Grid } from "@material-ui/core";
import React, { useEffect, useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Tab } from "semantic-ui-react";
import MainService from "../../../../api/service";
import { ResourceType, VALIDS_LOM } from "../../../../constants";
import { ResourceFormContex, resourceFormInitalState, FormAction, ResourceFormState } from "./ResourceFormContext";
import LomForm from '../../LOM/LomForm';
import { setLomesSchema, setLomSchema } from '../../../../appSlice';
import { MainDataTab } from "./MainDataTab";

function resourceFormReducer(state: ResourceFormState, action: { type: string, payload?: any }): ResourceFormState {

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

function useLoms(action, data) {
    const dispatch = useDispatch();
    const [lomPanes, setLomPanes] = useState([]);

    useEffect(() => {

        if (action === FormAction.CREATE) {
            setLomPanes([]);
            return;
        }

        const fetchLomesSchema = async () => {
            let lomesSchema = await MainService().getLomesSchema();
            dispatch(setLomesSchema(lomesSchema));
        }

        const fecthLomSchema = async () => {
            const lomSchema = await MainService().getLomSchema();
            dispatch(setLomSchema(lomSchema));
        }

        let lomesl = localStorage.getItem('lomes_loaded');
        if (lomesl === null || lomesl === '0') {
            fetchLomesSchema()
            localStorage.setItem('lomes_loaded', '1');
        }

        let loml = localStorage.getItem('lom_loaded');
        if (loml === null || loml === '0') {
            fecthLomSchema()
            localStorage.setItem('lom_loaded', '1');
        }

        const panes = VALIDS_LOM.map(lom => ({
            menuItem: lom.name,
            render: () => (
                <Tab.Pane>
                    <LomForm
                        data={data}
                        standard={lom.key}
                    />
                </Tab.Pane>
            )})
        );

        setLomPanes(panes);
    }, [action]);

    return lomPanes;
}

function useMainData() {
    return {
        menuItem: 'Main Data',
        render: () => (<Tab.Pane><MainDataTab /></Tab.Pane>)
    }
}

const ResourceForm = (
    { resourceType, schema, dataForUpdate = null, handleClose }:
        { resourceType: ResourceType, schema: any, dataForUpdate?: any, handleClose: () => void }) => {

    const _refForm = React.useRef(null);
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

    const mainPane = useMainData();
    const lomsPanes = useLoms(state.action, dataForUpdate);

    return (
        <ResourceFormContex.Provider value={{ state, dispatch }}>
            <DialogContent className='edit-create-dialog-content'>
                <DialogContentText>
                    <Button color='teal' circular icon='close' onClick={() => handleClose()} className='read-card-close-button' />
                </DialogContentText>
                <Grid container spacing={2}>
                    <Grid item sm={12} id='form-content'>
                        <Tab panes={[mainPane, ...lomsPanes]} />
                    </Grid>
                </Grid>
            </DialogContent>
        </ResourceFormContex.Provider>
    );
}

export default ResourceForm;