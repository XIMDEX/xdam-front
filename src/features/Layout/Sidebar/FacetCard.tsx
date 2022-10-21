import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Button, IconButton, Typography, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash'
import { ORGANIZATION, COLLECTION, LANGUAGE_FACET, WORKPSACES } from '../../../constants';
import { setFacetsQuery, selectQuery } from '../../../slices/organizationSlice';
import { setResourcesLoading } from '../../../appSlice';
import ClearIcon from '@material-ui/icons/Clear';
import { Icon } from 'semantic-ui-react';
import EFacetNameMapping from './EFacetNameMapping';
import FacetItems from './FacetItems';
import useSupplementaryData from '../../../hooks/useSupplementaryData';

const LIMIT_ITEMS = 10;

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

export function FacetCard({ facet, fixed, resources, collection, organization, facetsQuery }) {
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
    const supplementaryData = useSupplementaryData(facet);
    const [selectedWS, setSelectedWS] = useState([])

    const [showMore, setShowMore] = useState<Boolean>(false)

    useEffect( () => {
        let values_selected = Object.keys(facet.values).filter(name => {
            return facet.values[name].selected || selectedWS.includes(name)
        })
        let values_non_selected = Object.keys(facet.values).filter(name => !facet.values[name].selected  && !selectedWS.includes(name))
        let new_values = [...values_selected, ...values_non_selected]
        let values_obj = {}
        if (!showMore ) {
            let limit = LIMIT_ITEMS

            if (values_selected.length > 0) {
                if (values_selected.length < LIMIT_ITEMS) {
                    limit -= values_selected.length
                } else {
                    limit = 0
                }
            }
            new_values = values_non_selected.slice(0, limit)
        }
        new_values = [...values_selected, ...new_values]
        new_values.forEach(value => values_obj[value] = facet.values[value])
        if (search === '') {
            setFacetValues(values_obj)
        }
    }, [collection, facetsQuery, organization, resources, showMore, selectedWS])

    function onFilterChange(e) {
        setSearch(e.target.value);
        var result = _.pickBy(values, function(value, key) {
            const k = supplementaryData[key]?.name || key;

            return _.includes(k.toLowerCase(), e.target.value.toLowerCase());
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

        if (facet.key === LANGUAGE_FACET) {
            return 'Language';
        }

        return facet.label
    }

    const handleShowMore = () => setShowMore(!showMore)

    const handleFilterSelected = (value, isChecked) => {
        let newValues = {...facetValues}
        newValues[value] = {...newValues[value], selected: isChecked}
        setFacetValues(newValues)
        if (isChecked && !selectedWS.includes(value)) {
            setSelectedWS([...selectedWS,value ])
        }
        if (!isChecked && selectedWS.includes(value)) {
            setSelectedWS(selectedWS.filter(ws => ws !== value))
        }
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
                        {organization && collection &&  (
                                <FacetItems
                                    supplementaryData={supplementaryData}
                                    fixed={fixed}
                                    facet={facet}
                                    facetValues={facetValues}
                                    currentFacets={currentFacets}
                                    limit_items={LIMIT_ITEMS}
                                    onFilterSelected={handleFilterSelected}
                                />
                        )}
                    </ul>
                    </Grid>
                    { Object.keys(values).length > LIMIT_ITEMS  && (
                        <Grid item sm={12} style={{marginBottom: 10, marginTop: -10, textAlign: 'right'}}>
                            <Button onClick={handleShowMore} style={{fontSize: 8}} size='small'>Show {showMore ? 'less' : 'more'}...</Button>
                        </Grid>
                    )

                    }
                </div>
            </Grid>

    );
}


