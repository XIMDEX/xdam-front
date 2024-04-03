import "./App.css";
import "semantic-ui-css/semantic.min.css";
import "./theme/main.scss";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setUser,
    selectUser,
    setResourcesLoading,
    selectReloadApp,
    setWorkspaceCollections,
} from "./appSlice";
import { useHistory, useLocation } from "react-router-dom";
import MainService from "./api/service";
import {
    selectCollection,
    selectOrganization,
    selectFacetsQuery,
    setFacetsQuery,
    setOrganization,
    setQuery,
    selectQuery,
} from "./slices/organizationSlice";
import { setCollections, setCurrentCollection } from "./slices/collectionSlice";
import Routes from "./routes/Routes";


function App() {
    const reloadApp = useSelector(selectReloadApp);
    const history = useHistory()
    const dispatch = useDispatch();
    const mainService = MainService();
    const facetsQuery = useSelector(selectFacetsQuery);
    const organization_id = useSelector(selectOrganization);
    const collection_id = useSelector(selectCollection);
    const [initialOrganization, setInitialOrganization] = useState(null);
    const [initialCollection, setInitialCollection] = useState(null);
    const [localUser, setLocalUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initUser = async () => {

            if (mainService.getToken()) {
                if (!localUser) {
                    let fetchedUser = await MainService().getUser();
                    if (fetchedUser?.error) {
                        setLoading(false);
                        setLocalUser(null);
                        return alert(
                            "Error loading user: " + fetchedUser.error
                        );
                        // throw new Error('Error1.1: ' + fetchedUser.error);
                    }
                    setLocalUser(fetchedUser);
                    dispatch(setUser(fetchedUser));
                }
            }else{
                history.push('/login')
            }
            setLoading(false);
            return;
        };

        const prepareData = () => {
            if (localUser && !organization_id && !collection_id) {
                setInitialOrganization(localUser.data.selected_org_data.id);
                setInitialCollection(
                    localUser.data.selected_org_data.collections[0].id
                );
                dispatch(
                    setOrganization({
                        oid: initialOrganization,
                        cid: initialCollection,
                    })
                );
                dispatch(
                    setCurrentCollection(localUser.data.selected_org_data.collections[0].id)
                )
                dispatch(setCollections(localUser.data.selected_org_data.collections));
                localStorage.setItem("lomes_loaded", "0");
                localStorage.setItem("lom_loaded", "0");

                dispatch(setWorkspaceCollections(localUser.data.selected_org_data.workspaces));
            }
        };

        initUser();
        prepareData();

    }, [
        reloadApp,
        localUser,
        collection_id,
        organization_id,
        facetsQuery,
        initialOrganization,
        initialCollection,
    ]);

    return <Routes/>

    // if (location.pathname.startsWith('/cdn/')) {
    //     return ( <CdnRenderPage /> )
    // } else if (location.pathname === "/lom") {
    //     return ( <LomPage handleCookie={handleCookie} handleLoading={handleLoading} loading={loading}/> );
    // } else if ( location.pathname.startsWith("/resource/") && location.pathname.endsWith("/preview") && localUser ) {
    //     return ( <ResourcePreviewPage /> );
    // } else if (location.pathname === '/cdn_panel' && localUser) {
    //     return ( <CdnPanelPage user={user}/> )
    // } else if (localUser) {
    //     return ( <HomePage
    //             user={user}
    //             loading={loading}
    //             toggleSidebar={toggleSidebar}
    //             clearAllFilters={clearAllFilters}
    //             facetsQuery={facetsQuery}
    //             organization_id={organization_id}
    //             collection_id={collection_id}
    //             sidebarOpen={sidebarOpen}
    //             classes={classes}
    //         />);
    // } else {
    //     return (<LoginPage loading={loading} />);

    // }
}


export default App;
