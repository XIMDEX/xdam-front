import { Button, makeStyles } from "@material-ui/core"
import React, { useReducer, useState } from "react"
import { useEffect } from "react"
import { Grid, Icon } from "semantic-ui-react"
import MainService from "../api/service"
import { Header } from "../features/Layout/Header/Header"
import Sidebar from "../features/Layout/Sidebar/Sidebar"
import { Resources } from "../features/Resources/Resources"
import { QueryActions, ResourceQueryContex, resourceQueryReducers } from "../reducers/ResourceQueryReducer"

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
        },
        facetsHeader: {
            paddingLeft: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems:'center'
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

    const thereAreFacetsSelected = (facets): boolean => {
        if(!facets || facets.length === 0) return false;

        const facetKeys = Object.keys(facets);

        if(!facetKeys || facets.length === 0) return false;

        return facetKeys.some((key) => facets[key].length > 0);
    }
    
    const toggleSidebar = () => {
        var toggle = !sidebarOpen;
        setSidebarOpen(toggle)
    }

    useEffect(() => {
        const getCatalogue =async (collectionId: number) => {
            const { page, search, limit, facets } = query;
            
            const catalogue = await MainService().catalogue().getCatalogue(
                collectionId,
                {
                    page,
                    query: search,
                    limit,
                    facets
                })
                .then(response => response.json())
            
            const pagination = {
                perPage: catalogue.per_page,
                lastPage: catalogue.last_page,
                nextPage: catalogue.next_page,
                prevPage: catalogue.prev_page,
                total: catalogue.total
            };
            
            setResources(catalogue.data);
            setPagination(pagination);
            setFacets(catalogue.facets);
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
                    <div className="mt-2">
                        <button hidden={!sidebarOpen} onClick={toggleSidebar} className='xdam-btn-primary bg-primary float-right btn-round-left btn-half-square toggleFacetsClose'>
                            <Icon name='angle left' />
                        </button>
                        <div className={classes.facetsHeader}>
                            <span className='mt-2 '>
                                <strong className={'darkLabel'}>FACETS</strong>
                            </span>
                            {thereAreFacetsSelected(query.facets) ? (
                                <Button color="primary" style={{ marginRight: 10 }} variant='outlined' onClick={clearFacets} >
                                    Clear all filters
                                </Button>
                            ) : null}
                        </div>
                        
                    </div>
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
