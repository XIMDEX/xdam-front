import { LinearProgress, Button, makeStyles } from "@material-ui/core"
import { PlaylistAddOutlined } from "@material-ui/icons"
import React, { useContext, useReducer, useState } from "react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Grid, Icon } from "semantic-ui-react"
import MainService from "../api/service"
import { Header } from "../features/Layout/Header/Header"
import Sidebar from "../features/Layout/Sidebar/Sidebar"
import { Resources } from "../features/Resources/Resources"
import { QueryActions, ResourceQueryContex, resourceQueryReducers } from "../reducers/ResourceQueryReducer"
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

    const [catalogue, setCatalogue] = useState({});

    const [query, dispatch] = useReducer(
        resourceQueryReducers,
        {
            organizationId: null,
            collection: null,
            search: '',
            limit: 48,
            page: 1
        }
        );

    const clearAllFilters = () => {
        dispatch({
            type: QueryActions.ClearFilters
        })
    }

    const isEmpty = (facets: null | Record<any, any>): boolean => {
        if(!facets) return false;

        return Object.keys(facets).length > 0;
    }
    
    const toggleSidebar = () => {
        var toggle = !sidebarOpen;
        setSidebarOpen(toggle)
    }

    useEffect(() => {
        const getCatalogue =async (collectionId: number) => {
            const { page, search, limit } = query;
            
            const reponse = await MainService().catalogue().getCatalogue(
                collectionId,
                {
                    page,
                    query: search,
                    limit
                });

            const json = await reponse.json();
            setCatalogue(json)
        }

        if (!query.collection)
            return;

        getCatalogue(query.collection.id);

    }, [query]);

    return (
        <ResourceQueryContex.Provider value={{ query, dispatch }}>
            <Header/>
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
                    {(query.collection && query.collection.id && query.organizationId) ? (
                        <Sidebar
                            collection={query.collection.id}
                            organization={query.organizationId} />
                    ) : ''}
                </div>
                <div style={{ marginTop: 4 }} className={!sidebarOpen ? 'RCFullWidth' : 'RCWithSidear'} id='main-r-c'>
                    <Resources collection={query.collection} catalogue={catalogue} />
                </div>
            </div>
        </ResourceQueryContex.Provider>
    );
}
