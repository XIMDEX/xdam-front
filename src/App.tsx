import './App.css';
import 'semantic-ui-css/semantic.min.css'
import './theme/main.scss';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectReloadApp } from './appSlice';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme'
import MainService from './api/service'
import { makeStyles } from '@material-ui/core/styles';
import { selectCollection, selectOrganization, selectFacetsQuery, selectQuery } from './slices/organizationSlice';
import _ from 'lodash';
import { XdirPayload } from './api/XdirAuthService';
import { Home } from './pages/Home';
import { Login } from './features/Login/Login';


const useStyles = makeStyles(() => {
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
  const reloadApp = useSelector(selectReloadApp);
  const mainService = MainService();
  const facetsQuery = useSelector(selectFacetsQuery);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  let organization_id = useSelector(selectOrganization);
  let collection_id = useSelector(selectCollection);
  const [initialOrganization, setInitialOrganization] = useState(null);
  const [initialCollection, setInitialCollection] = useState(null);
  const [localUser, setLocalUser] = useState<XdirPayload>(null);
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    const loadLoggedUserInfo = async () => {
      if (!mainService.getToken()) {
        setLoading(false);
        return;
      }

      if(localUser) {
        setLoading(false);
        return;
      }

      setLoading(false);
    }

    const prepareData = () => {
      if(localUser && !organization_id && !collection_id) {
        //setInitialOrganization(localUser.data.selected_org_data.id)
        //setInitialCollection(localUser.data.selected_org_data.collections[0].id)
        //dispatch(setOrganization({oid: initialOrganization, cid: initialCollection}))
        localStorage.setItem('lomes_loaded', '0');
        localStorage.setItem('lom_loaded', '0');
      }
    }

    loadLoggedUserInfo();
    prepareData();
    
  }, [reloadApp, localUser, collection_id, organization_id, facetsQuery, initialOrganization, initialCollection]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace /> } />
          <Route path="login" element={<Login />} />
          <Route path="home" element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>        
  )
}

export default App;

function RequireAuth({ children }: { children: JSX.Element }) {

  const token = MainService().getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}