import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import {LoginPage} from '../pages/LoginPage';
import CdnPanelPage from '../pages/CdnPanelPage';
import CdnRenderPage from '../pages/CdnRenderPage';
import ResourcePreviewPage from '../pages/ResourcePreviewPage';
import SearchPage from '../pages/SearchPage';

export default function Routes () {
    return (
        <Switch>
            <Route exact path={'/home'} component={HomePage}/>
            <Route path={'/login'} component={LoginPage}/>
            <Route path={'/cdn_panel'} component={CdnPanelPage}/>
            <Route path={'/cdn'} component={CdnRenderPage}/>
            <Route path={'/resource'} component={ResourcePreviewPage}/>
            <Route path={'/search'} component={SearchPage}/>
        </Switch>
    );
}
