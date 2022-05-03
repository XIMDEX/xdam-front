import React from "react"
import { Grid } from '@material-ui/core';
import MetaDataForm from "./MetaDataForm"
import { ResourceFiles } from "./ResourceFiles"


const MainDataForm = () => {
    return (
        <Grid container style={{ height: '75vh' }}>
            <Grid item sm={6}>
                <ResourceFiles />
            </Grid>
            <Grid item sm={6}>
                <MetaDataForm />
            </Grid>
        </Grid>
    )
};

export default MainDataForm