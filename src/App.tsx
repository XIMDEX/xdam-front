import './App.css';
import 'semantic-ui-css/semantic.min.css'
import './theme/main.scss';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, selectUser, setLoading, selectLoading, setResourcesLoading, selectReloadApp } from './appSlice';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Login } from './features/Login/Login';
import { Header } from './features/Layout/Header/Header';
import { Loading } from './features/Loading/Loading';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme'
import MainService from './api/service'
import { Grid, Button, LinearProgress } from '@material-ui/core';
import Sidebar from './features/Layout/Sidebar/Sidebar';
import { makeStyles } from '@material-ui/core/styles';
import { Resources } from './features/Resources/Resources';
import { selectCollection, selectOrganization, selectFacetsQuery, setFacetsQuery, setOrganization, setQuery, selectQuery } from './slices/organizationSlice';
import _ from 'lodash';
import { Icon } from 'semantic-ui-react';


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
    }
  }
});

function App() {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const reloadApp = useSelector(selectReloadApp);
  const dispatch = useDispatch();
  const mainService = MainService();
  const facetsQuery = useSelector(selectFacetsQuery);
  const query = useSelector(selectQuery);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  let organization_id = useSelector(selectOrganization);
  let collection_id = useSelector(selectCollection);
  const [initialOrganization, setInitialOrganization] = useState(null);
  const [initialCollection, setInitialCollection] = useState(null);
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function clearAllFilters()
  {
    let newQuery = {
      ...query
    };

    newQuery.page = 1;
    newQuery.search = '';
    dispatch(setQuery(newQuery));

    dispatch(setResourcesLoading(true))
    dispatch(setFacetsQuery({}))  
  }
  
  function toggleSidebar()
  {
      var toggle = !sidebarOpen;
      setSidebarOpen(toggle)
  }

  useEffect( () => {
    const initUser = async () => {
      if (mainService.getToken()) {
        if(!localUser) {
          let fetchedUser = await MainService().getUser();
          if (fetchedUser.error) {
            alert('Error loading user: ', fetchedUser.error);
            throw new Error('Error1.1: ' + fetchedUser.error);
          }
          setLocalUser(fetchedUser);
          dispatch(setUser(fetchedUser));
        }
      }
      setLoading(false);
      return;
    }

    const prepareData = () => {
      if(localUser && !organization_id && !collection_id) {
        setInitialOrganization(localUser.data.selected_org_data.id) 
        setInitialCollection(localUser.data.selected_org_data.collections[0].id)
        dispatch(setOrganization({oid: initialOrganization, cid: initialCollection}))
        localStorage.setItem('lomes_loaded', '0');
      }
    }

    initUser();
    prepareData();
    
  }, [reloadApp, localUser, collection_id, organization_id, facetsQuery, initialOrganization, initialCollection]);

  if (localUser) {
    return (
      <Container maxWidth='xl' disableGutters>
        {/* {
          !sidebarOpen ? (
            <div className='closedFacetsBG' style={{height: document.body.scrollHeight - 83}}> </div>
          ) : null
        } */}
        {
          !sidebarOpen ? (
            <div>
              
                <button onClick={toggleSidebar} className='xdam-btn-secondary bg-secondary btn-round-right btn-half-square toggleFacetsOpen' >
                  <Icon name='angle right'/>
                </button>
              
            </div>
          ) : null
        }
        <ThemeProvider theme={theme}>
        <Router>
          <Redirect to={{pathname: "/home"}}/>
            {loading ? (<Loading />) : null}
            <Grid container>            
              <Grid item sm={12} className='main-header'>
                {
                  (organization_id && collection_id) ? (
                    <Header _user={user}/>
                  ) : ''
                }
              </Grid>
            </Grid>
            <div className={!sidebarOpen ? 'sidebarAndResourcesConainerFW' : 'sidebarAndResourcesConainer'}>
              <div className={!sidebarOpen ? 'sideBarHidden' : 'sideBar'}>
                <Grid container className='justifyContentBetween mt-2'>
                  <span className='facets_title mt-2 '>
                    <strong className={'darkLabel'}>FACETS</strong>
                  </span>
                  <button hidden={!sidebarOpen} onClick={toggleSidebar} className='xdam-btn-primary bg-primary float-right btn-round-left btn-half-square toggleFacetsClose' >
                    <Icon name='angle left'/>
                  </button>
                </Grid>
                {
                  !_.isEmpty(facetsQuery) ? (
                    <Button color="primary" style={{marginRight: 27}} variant='outlined' onClick={clearAllFilters} className={classes.clearAllFilters}>
                      Clear all filters
                    </Button>
                  ) : null
                } 
                {
                  (organization_id && collection_id) ? (
                    <Sidebar 
                      collection={collection_id} 
                      organization={organization_id} 
                    />
                  ) : ''
                }
              </div>
              <div style={{marginTop: 4}} className={!sidebarOpen ? 'RCFullWidth' : 'RCWithSidear'} id='main-r-c'>
                <Switch>
                  <Route path="/home">
                    
                    <LinearProgress id='circular-progress' className={'dnone'}></LinearProgress>
                    {
                      (organization_id && collection_id) ? (
                        <Resources 
                          sidebarOpen={sidebarOpen} 
                          collection={collection_id} 
                          organization={organization_id}
                          _user={user}
                        />
                      ) : ''
                    }

                  </Route>
                </Switch>
              </div>
            </div>
          </Router>
        </ThemeProvider>
      </Container>
  );  
  } else {
    return (
      <ThemeProvider theme={theme}>
          <Router>
            {loading ? (<Loading text="Loading user data..."/>) : (<Login />)}            
          </Router>
      </ThemeProvider>        
    )
  }  
}

export default App;

