import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MainService from "../../../../api/service";
import { selectCollection } from "../../../../slices/organizationSlice";
import FormButtons from "./FormButtons";
import MetaDataForm from "./MetaDataForm";
import { ResourceFiles } from "./ResourceFiles";
import { ResourceFormContex, FormAction } from "./ResourceFormContext";
import { submitResource } from "./submitResource";

export const MainDataTab = () => {
    const { state, dispatch } = useContext(ResourceFormContex);
    const collectionId = useSelector(selectCollection);
    const [lastSync, setLastSync] = useState(Date.now());
    
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

        setLastSync(Date.now());
    }

    useEffect(() => {
        async function fetchFiles() {
            const resource = await MainService().getResource(state.resourceId);
            dispatch({ type: 'resource_retrived', payload: resource.files });
        }

        if (state.resourceId) {
            fetchFiles();
        }
    }, [lastSync]);

    return (
        <>
            <FormButtons save={submit} />
            <Grid container style={{ height: '75vh' }}>
                <Grid item sm={6}>
                    <ResourceFiles />
                </Grid>
                <Grid item sm={6}>
                    <MetaDataForm />
                </Grid>
            </Grid>
        </>
    );
}