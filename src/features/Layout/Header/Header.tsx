import React, { useState } from 'react'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Typography } from '@material-ui/core';
import { Dropdown, Image } from 'semantic-ui-react'
import { makeStyles } from '@material-ui/core/styles';
import MainService from '../../../api/service';
import { setLoading, selectFixedFacets } from '../../../appSlice';
import { selectQuery } from '../../../slices/organizationSlice';
import { Search } from '../../Resources/Search';
import OrganizationSwitch from './OrganizationSwitch';

const useStyles = makeStyles((theme) => ({
    root: {
      borderBottom: '1px solid #9eadba',
      marginTop: 20,
      padding: '0 10px',
      paddingBottom: 23
    },
    headerContent: {
      maxHeight: 40
    },
    title: {
      fontWeight: 'bolder',
      marginBottom: 20,
      color: '#02947d'
    },
    logout: {
      float: 'right', 
      marginTop: 5,
    },
    divSearch: {
      display: 'flex'
    },
    rightHeader: {
      display: 'flex',
      justifyContent: 'flex-end',
      maxHeight: 38
    },

    headerWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '15px'
    },
    controlls: {
      display: 'flex',
    },
    logo: {
      textDecoration: 'none',
      marginRight: 'auto'
    }
  }
));

export function Header({ updateOrganizationId, updateCollectionId, updateSearchTerm }) { 
  const classes = useStyles();
  const dispatch = useDispatch();

  const [organizationId, setOrganizationId] = useState(null);
  
  const logout = () => {
    dispatch(setLoading(true))
    MainService().logout()
  }
  const changeOrganizationId = (organizationId) => {
    setOrganizationId(organizationId);
    updateOrganizationId(organizationId);
  }

  const changeCollectionId = (collectionId) => {
    updateCollectionId(collectionId);
  }

  return (
    <div id="header" className={classes.headerWrapper}>
      <Link to="/home" className={classes.logo}>
          <Image src='logotipo_ximdex-DAM-small-header.png' className='headerLogo'></Image>
      </Link>

      <div className={classes.controlls}>

          {
            <div className={classes.divSearch}>
            <Search organizationId={organizationId} switchCollection={changeCollectionId} />
            </div>
          }
        <OrganizationSwitch switchOrganizationId={changeOrganizationId} />
      </div>

      <div className={classes.rightHeader}>
            <Dropdown
              text='Profile'
              floating
              button
            >
              <Dropdown.Menu>
                <Dropdown.Item onClick={logout} >Logout</Dropdown.Item>      
              </Dropdown.Menu>
            </Dropdown>
      </div>
    </div>
  );
}