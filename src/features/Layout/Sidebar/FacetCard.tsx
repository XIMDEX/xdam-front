import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Button, IconButton, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash'
import { ORGANIZATION, COLLECTION } from '../../../constants';
import { setFacetsQuery, selectQuery } from '../../../slices/organizationSlice';
import { setResourcesLoading } from '../../../appSlice';
import ClearIcon from '@material-ui/icons/Clear';
import { Icon } from 'semantic-ui-react';
import EFacetNameMapping from './EFacetNameMapping';
import FacetItems from './FacetItems';

const useStyles = makeStyles((theme) => ({
    sidebarRoot: {
      "& ul": {
        paddingLeft: 8
      },
      width: 'calc(100% - 30px)',
      marginBottom: 10,
      marginLeft: 15,
      backgroundColor: '#FFF',
      '& .MuiOutlinedInput-inputMarginDense': {
        paddingTop: 4.5,
        paddingBottom: 4.5
      },
    },
    cardFacet: {
        width: '100%',
        padding: '0 4px'
    },
    headerContent: {
      maxHeight: 40
    },
    hidden: {
        display: 'none'
    },
    margin: {
        padding: 5,
    },
    title: {
      fontWeight: 'bolder',
      marginBottom: 20
    },
    capitalize: {
        textTransform: 'capitalize' 
    },
    clearIcon: {
        position: 'relative',
        top: 3,
        right: 3,
        paddingLeft: 3,
        transform: 'scale(0.75)'
    }
  }
));

export function FacetCard({ facet, fixed, resources, collection, organization, facetsQuery, _user }) { 
    const classes = useStyles()
    const values = facet.values ?? {}
    const dispatch = useDispatch()
    const [facetValues, setFacetValues] = useState(values)
    const [errors, setErrors] = useState([])
    const [cardOpen, setCardOpen] = useState(facet.key === COLLECTION || facet.key === ORGANIZATION ? false : true)
    const selectedOrg = organization
    const selectedColl = collection
    const [search, setSearch] = useState('')
    const currentFacets = JSON.parse(JSON.stringify(facetsQuery));
    const cQuery = useSelector(selectQuery);
    
    useEffect( () => {
        if (search === '') {
            setFacetValues(facet.values)
        }
    }, [collection, facetsQuery, organization, resources])
    
    function onFilterChange(e) {
        setSearch(e.target.value);
        var result = _.pickBy(values, function(value, key) {
            
            return _.includes(key.toLowerCase(), e.target.value.toLowerCase());
        });
        setFacetValues(result)
    }

    function Errors(): any
    {
        return (
            errors.map((error) => (
                <span>{error}</span>
            ))
        )
    }
    
    function clearFilter(evt)
    {
        const facetKey = facet.key;
        if (currentFacets.hasOwnProperty(facetKey)) {
            delete currentFacets[facetKey]
        }
        dispatch(setResourcesLoading(true))
        dispatch(setFacetsQuery(currentFacets))
    }

    function toggleCard()
    {
        var toggle = !cardOpen;
        setCardOpen(toggle)
    }

    function label()
    {
        if (facet.key === ORGANIZATION && typeof selectedOrg === 'object') {
            return selectedOrg.name
        }
        if (facet.key === COLLECTION && typeof selectedColl === 'object') {
            return selectedColl.name
        }

        if (facet.key in EFacetNameMapping) {
            return EFacetNameMapping[facet.key];
        }

        return facet.label
    }
    
    return (
        
        <Grid container className={`${classes.sidebarRoot} ${cardOpen ? 'cardOpen' : null} facetCard facets-context`} >
                {/* Errors */}
                <Grid item sm={12}>
                    <Errors />
                </Grid>
                {/* Facet title */}
                <Grid container>
                    <Grid item sm={!fixed && currentFacets.hasOwnProperty(facet.key) ? 11 : 12}>
                        <Button aria-label="facet-title" 
                            onClick={toggleCard} 
                            fullWidth 
                            endIcon={cardOpen ? (<Icon name='minus' size='small'/>) : (<Icon name='plus' size='small' />)}
                        >
                            <Grid container>
                                <Grid item sm={12}>
                                    <Typography className={classes.capitalize} align='left' color='primary'>
                                        <strong className={!cardOpen ? 'darkLabel' : 'whiteLabel'}>{label()}</strong>
                                    </Typography>    
                                </Grid>
                            </Grid>
                        </Button>
                    </Grid>
                    {
                        !fixed && currentFacets.hasOwnProperty(facet.key) ? (
                            <Grid item sm={1}>
                                <IconButton color='primary' size='small' onClick={clearFilter} className={classes.clearIcon}>
                                    <ClearIcon color='secondary'/>
                                </IconButton>
                            </Grid>
                        ) : null
                    }
                </Grid>
                <div className={cardOpen ? classes.cardFacet : classes.hidden}>
                    {
                        Object.keys(facetValues).length > 4 && search === '' ? (
                        // true ? (
                            <Grid item sm={12}>
                                <TextField 
                                    onChange={ onFilterChange } 
                                    placeholder='search' 
                                    size='small'
                                    fullWidth
                                />
                            </Grid>
                        ) : (search !== '' ? (
                            <Grid item sm={12}>
                                <TextField 
                                    onChange={ onFilterChange } 
                                    placeholder='search' 
                                    size='small'
                                    fullWidth
                                />
                            </Grid>
                        ) : null)
                    }
                    
                    {/* Facet values */}
                    <Grid item sm={12}>
                    <ul> 
                        {
                            organization && collection ? (<FacetItems fixed={fixed} facet={facet} facetValues={facetValues} currentFacets={currentFacets}/>) : ''
                        }
                    </ul>
                    </Grid>
                </div>
            </Grid>
        
    );
}


