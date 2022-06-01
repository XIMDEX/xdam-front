import { makeStyles } from "@material-ui/core";
import React from "react";
import { Grid } from "semantic-ui-react";
import { Resource } from "./Resource";


const useStyles = makeStyles((theme) => ({
    loadingResources: {
        width: '100%',
        '& p': {
            position: 'relative',
            textAlign: 'center',
            left: '0',
            top: '200px'
        }
    }, listContainer: {
        marginTop: 15
    },
    gridContainer: {
        marginTop: 15
    }
}));


const ResCont = ({ resources, collection, listMode }): JSX.Element => {
    const classes = useStyles();

    const ResourcesNotFound = (): any => {
        return (
            <div className={classes.loadingResources}>
                <p>Resources not found</p>
            </div>
        )
    }

    if (!resources) {
        return <span>Loading</span>
    }

    if (resources && resources.length === 0) {
        return <ResourcesNotFound />
    }

    const ContainerList = resources.map((item: any, key) => (
        <Grid item xs={12} key={key} className='striped'>
            <Resource data={item} resourceType={collection?.resource_type} listMode={listMode} />
        </Grid>
    ))

    const ContainerGrid = resources.map((item: any, key) => (
        <Grid key={key} item sm={12} md={3} lg={2} xl={1} >
            <Resource data={item} resourceType={collection.resource_type} listMode={listMode} />
        </Grid>
    ))

    return (<>
        {
            listMode ? (
                <Grid container className={classes.listContainer}>
                    {ContainerList}
                </Grid>
            ) :
                (
                    <Grid container spacing={1} className={classes.gridContainer}>
                        {ContainerGrid}
                    </Grid>
                )
        }
    </>);
}

export default ResCont;