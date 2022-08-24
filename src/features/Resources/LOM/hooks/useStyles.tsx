import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    '& [id^="vertical-tabpanel-"]': {
      width: '100%'
    },
    minHeight: '80vh'
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: 220
  },
  tabPanel: {
    width: '100%'
  },
  blur: {
    width: '100%',
    height: '100%',
    '&::before': {
      content: '""',
      right: 0,
      top: 0,
      width: '73%',
      height: '100%',
      position: 'absolute',
      background: '#ffffff4a',
      backdropFilter: 'blur(2px)',
      zIndex: 1,
    }
  },
}));

export default useStyles;