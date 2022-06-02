import { Button, makeStyles } from "@material-ui/core"
import React, { useReducer, useState } from "react"
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

interface Facet {
    key: string,
    label: string,
    values: { [x: string]: any },
}

export const Home = () => {
    const classes = useStyles();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const facetsQuery = useSelector(selectFacetsQuery);
    const [resources, setResources] = useState([]);
    const [facets, setFacets] = useState<Facet[]>([]);
    const [pagination, setPagination] = useState(null);

    const [query, dispatch] = useReducer(
        resourceQueryReducers,
        {
            organizationId: null,
            collection: null,
            facets: [],
            search: '',
            limit: 48,
            page: 1
        }
    );

    const clearFacets = () => {
        dispatch({
            type: QueryActions.ClearFacets
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
            const { page, search, limit, facets } = query;
            
            const reponse = await MainService().catalogue().getCatalogue(
                collectionId,
                {
                    page,
                    query: search,
                    limit,
                    facets
                });

            const json = await reponse.json();
            
            const pagination = {
                perPage: json.per_page,
                lastPage: json.last_page,
                nextPage: json.next_page,
                prevPage: json.prev_page,
                total: json.total
            };
            
            setResources(json.data);
            setPagination(pagination);
            setFacets(json.facets);
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
                        <Button color="primary" style={{ marginRight: 27 }} variant='outlined' onClick={clearFacets} className={classes.clearAllFilters}>
                            Clear all filters
                        </Button>
                    ) : null}
                    {(query.collection && query.collection.id && query.organizationId) ? (
                        <Sidebar facets={facets}/>
                    ) : ''}
                </div>
                {!sidebarOpen &&
                    <button onClick={toggleSidebar} className='xdam-btn-secondary bg-secondary btn-round-right btn-half-square toggleFacetsOpen'>
                    <Icon name='angle right' />
                </button>
                }
                <div style={{ marginTop: 4 }} className={!sidebarOpen ? 'RCFullWidth' : 'RCWithSidear'} id='main-r-c'>
                    <Resources collection={query.collection} pagination={pagination} facets={facets} resources={resources} />
                </div>
            </div>
        </ResourceQueryContex.Provider>
    );
}
