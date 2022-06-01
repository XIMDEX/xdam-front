import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { selectFacets, selectFixedFacets, selectResources, selectUser, selectResourcesLoading } from '../../../appSlice';
import { FacetCard } from './FacetCard';
import { getOrgData, getCollData } from '../../../utils/dataFind';
import { selectCollection, selectFacetsQuery, selectOrganization } from '../../../slices/organizationSlice';
import withWidth from '@material-ui/core/withWidth';

const useStyles = makeStyles((theme) => ({
    sidebarComp: { 
      padding: '26px 15px'
    },
    headerContent: {
      maxHeight: 40
    },
    title: {
      fontWeight: 'bolder',
      marginBottom: 20
    },
    facetType: {
      background: 'blue',
      color: "white"
    }
  }
));

function Sidebar( { facets } ) { 
  const classes = useStyles();

  return (
    <Grid container className={`${classes.sidebarComp}`} > 
      <Grid item sm={12}>
        {
          facets?.length > 0 ? (
            facets.map( (item: any, key) => {
              return (
                <FacetCard key={key} facet={item} />
              )
            })
          ) : ''
        }
      </Grid> 
    </Grid>
  );
}

export default withWidth()(Sidebar);