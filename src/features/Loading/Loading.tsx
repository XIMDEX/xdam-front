import React from 'react'
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    root: {
      height: '100vh',
      position: 'absolute',
      top: 0,
      zIndex: 2,
      background: '#a7a7a74a',
      backdropFilter: 'blur(7px)'
    }, 
    circular: {
        marginTop: '45vh'
    },
    text: {
      position: 'absolute',
      top: '50vh'
    }
  }
));

export function Loading({text = ''}) { 
  const classes = useStyles();
  
  return (
    <Grid container justify="center" className={classes.root}>
      <CircularProgress className={classes.circular}/>
      <span className={classes.text}>{text}</span>
    </Grid>
  );
}