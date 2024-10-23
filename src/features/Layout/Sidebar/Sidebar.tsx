import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { selectFacets, selectFixedFacets, selectResources, selectUser, selectResourcesLoading } from '../../../appSlice';
import { FacetCard } from './FacetCard';
import { getOrgData, getCollData } from '../../../utils/dataFind';
import { selectFacetsQuery } from '../../../slices/organizationSlice';
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

function Sidebar({ collection, organization }) { 
  const classes = useStyles();
  const user = useSelector(selectUser)
  const selectedOrg = getOrgData(user, organization)
  const selectedColl = getCollData(selectedOrg, collection)
  const currentQuery = useSelector(selectFacetsQuery)
  const fixedFacets = useSelector(selectFixedFacets)
  const facets = useSelector(selectFacets)
  const resources = useSelector(selectResources)
  const resourcesLoading = useSelector(selectResourcesLoading)

  const mergedFacets = [];

  facets.forEach(facet => {
    const existingFacet = mergedFacets.find(f => f.label === facet.label);
    if (existingFacet) {
      existingFacet.values = { ...existingFacet.values, ...facet.values };
    } else {
      mergedFacets.push({ ...facet, values: { ...facet.values } });
    }
  });

  return (
    <Grid container className={`${classes.sidebarComp}`} > 
      <Grid item sm={12}>
        {
          mergedFacets.length > 0 ? (
            mergedFacets.map((item: any, key) => {
              return (
                <FacetCard key={key} 
                  facet={item} 
                  fixed={false} 
                  resources={resources} 
                  collection={selectedColl} 
                  organization={selectedOrg} 
                  facetsQuery={currentQuery}
                />
              )
            })
          ) : (resourcesLoading ? '' : '')
        }
      </Grid> 
    </Grid>
  );
}

export default withWidth()(Sidebar);