import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import MainService from "../../../../api/service";
import FormButtons from "./FormButtons";
import MetaDataForm from "./MetaDataForm";
import { ResourceFiles } from "./ResourceFiles";
import { ResourceFormContex } from "./ResourceFormContext";

export const MainDataTab = () => {
    const { state, dispatch } = useContext(ResourceFormContex);
    const [lastSync, setLastSync] = useState(Date.now());

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
            <FormButtons sync={setLastSync} />
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