import { makeStyles } from "@material-ui/core";
import React from "react";
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
    },
    gallery: {
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))'
    },
    galleryWrapper: {
        marginTop: '10px',
        padding: '0 10px'
    },
    list: {
        '& .element:nth-of-type(odd)': {
            backgroundColor: '#e8e8e8'
        }
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

    const style = listMode ? classes.list : classes.gallery;

    return (
        <div className={classes.galleryWrapper}>
            <div className={style}>
                {
                    resources.map((item: any, key) => (
                        <div key={key} className="element">
                            <Resource data={item} resourceType={collection?.accept} listMode={listMode} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default ResCont;