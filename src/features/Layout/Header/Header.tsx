import React, { useState } from 'react'
import { Link, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { Dropdown, Image } from 'semantic-ui-react'
import { makeStyles } from '@material-ui/core/styles';
import MainService from '../../../api/service';
import { setLoading, selectFixedFacets, selectUser } from '../../../appSlice';
import { selectQuery } from '../../../slices/organizationSlice';
import { Search } from '../../Resources/Search';
import OrganizationSwitch from './OrganizationSwitch';
import { SHOW_DAM_ORGANIZATIONS } from '../../../constants'

const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: "1px",
        marginTop: 20,
        padding: "0 10px",
        paddingBottom: 23,
        display: "fixed",
    },
    headerContent: {
        maxHeight: 40,
    },
    title: {
        fontWeight: "bolder",
        marginBottom: 20,
        color: "#02947d",
    },
    logout: {
        float: "right",
        marginTop: 5,
    },
    divSearch: {
        display: "flex",
    },
    rightHeader: {
        display: "flex",
        justifyContent: "flex-end",
        maxHeight: 38,
    },
}));

export function Header() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const query = useSelector(selectQuery);
  const [redirect, setRedirect] = useState(false);
  const _user = useSelector(selectUser);

  const fixedFacets = useSelector(selectFixedFacets);

  const logout = () => {
    dispatch(setLoading(true))
    MainService().logout()
  }

  const goToSearchPage = () => {
    window.location.href = '/search'
  }

  return (
    <Grid container>
        <Grid item sm={12} className="main-header">
            <Grid container className={classes.root}>
                <Grid item sm={3} >
                <Link to="/home" style={{textDecoration: 'none'}}>
                    <Image src='logotipo_ximdex-DAM-small-header.png' className='headerLogo'/>
                </Link>
                </Grid>
                <Grid item sm={6} >
                    {fixedFacets.length > 0 && (
                        <div className={classes.divSearch}>
                        <Search currentQuery={query} collections={fixedFacets[1].values}/>
                        </div>
                    )}
                </Grid>
                <Grid item sm={3} className={classes.rightHeader}>
                    {SHOW_DAM_ORGANIZATIONS && fixedFacets.length > 0 && ( <OrganizationSwitch organizations={fixedFacets[0].values} user={_user} />)}
                    <Dropdown text='Profile' floating button >
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                        <Dropdown.Item onClick={goToSearchPage}>Search</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown>

                </Grid>
            </Grid>
        </Grid>
    </Grid>
  );

}
