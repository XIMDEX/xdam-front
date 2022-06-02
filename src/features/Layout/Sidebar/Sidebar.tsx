import React, {  } from 'react'
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FacetCard } from './FacetCard';
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