import { LinearProgress, Button, makeStyles } from "@material-ui/core"
import React, { useState } from "react"
import { useSelector } from "react-redux"
import { Grid, Icon, Sidebar } from "semantic-ui-react"
import { Header } from "../features/Layout/Header/Header"
import { Resources } from "../features/Resources/Resources"
import { selectFacetsQuery } from '../slices/organizationSlice';


const useStyles = makeStyles((theme) => {
    let docHeight = document.body.scrollHeight

    return {
        '#root': {
            height: docHeight,
        },
        clearAllFilters: {
            position: 'absolute',
            top: 12,
            left: 180
        }
    }
});

export const Home = () => {
    const classes = useStyles();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const facetsQuery = useSelector(selectFacetsQuery);

    const [collectionId, setCollectionId] = useState(null);
    const [organizationId, setOrganizationId] = useState(null);
    const [searchTerm, setSearchTerm] = useState(null);

    const isEmpty = (facets: null | Record<any, any>): boolean => {
        if(!facets) return false;

        return Object.keys(facets).length > 0;
    }
    
    const toggleSidebar = () => {
        var toggle = !sidebarOpen;
        setSidebarOpen(toggle)
    }

    const clearAllFilters = () => {
        let newQuery = {
            // ...query
        };

        newQuery.page = 1;
        newQuery.search = '';
        // dispatch(setQuery(newQuery));

        // dispatch(setResourcesLoading(true))
        // dispatch(setFacetsQuery({}))
    } 

    return (
        <>
            <Header
                updateOrganizationId={setOrganizationId}
                updateCollectionId={setCollectionId}
                updateSearchTerm={setSearchTerm}
            />
        <div className={!sidebarOpen ? 'sidebarAndResourcesConainerFW' : 'sidebarAndResourcesConainer'}>
            <div className={!sidebarOpen ? 'sideBarHidden' : 'sideBar'}>
                <Grid container className='justifyContentBetween mt-2'>
                    <span className='facets_title mt-2 '>
                        <strong className={'darkLabel'}>FACETS</strong>
                    </span>
                    <button hidden={!sidebarOpen} onClick={toggleSidebar} className='xdam-btn-primary bg-primary float-right btn-round-left btn-half-square toggleFacetsClose'>
                        <Icon name='angle left' />
                    </button>
                </Grid>
                {!isEmpty(facetsQuery) ? (
                    <Button color="primary" style={{ marginRight: 27 }} variant='outlined' onClick={clearAllFilters} className={classes.clearAllFilters}>
                        Clear all filters
                    </Button>
                ) : null}
                    {(collectionId && organizationId) ? (
                    <Sidebar
                        collection={collectionId}
                        organization={organizationId} />
                ) : ''}
            </div>
            <div style={{ marginTop: 4 }} className={!sidebarOpen ? 'RCFullWidth' : 'RCWithSidear'} id='main-r-c'>
                    <span>
                        organization: {organizationId}
                        <br />
                        collection: {collectionId}
                    </span>

                    <LinearProgress id='circular-progress' className={'dnone'}></LinearProgress>
                    {(organizationId && collectionId) ? (
                        <Resources
                            sidebarOpen={sidebarOpen}
                            collection={collectionId}
                            organization={organizationId}
                            />
                    ) : ''}

            </div>
        </div>
        </>
    );
}
