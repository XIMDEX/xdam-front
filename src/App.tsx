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
} from "./appSlice";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useLocation,
} from "react-router-dom";
import MainService from "./api/service";
import { makeStyles } from "@material-ui/core/styles";
import {
    selectCollection,
    selectOrganization,
    selectFacetsQuery,
    setFacetsQuery,
    setOrganization,
    setQuery,
    selectQuery,
} from "./slices/organizationSlice";
import { useCookies } from "react-cookie";

import LomPage from "./pages/LomPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import ResourcePreviewPage from "./pages/ResourcePreviewPage";
import CdnPanelPage from "./pages/CdnPanelPage";
import CdnRenderPage from "./pages/CdnRenderPage";

const useStyles = makeStyles((theme) => {
    let docHeight = document.body.scrollHeight;

    return {
        "#root": {
            height: docHeight,
        },
        clearAllFilters: {
            position: "absolute",
            top: 12,
            left: 160,
            color: "teal",
            borderColor: "teal",
        },
    };
});

function App() {
    const [cookies, setCookie] = useCookies(["JWT"]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location?.search);
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

    const handleLoading = (status: boolean) => setLoading(status);

    function clearAllFilters() {
        let newQuery = {
            ...query,
        };

        newQuery.page = 1;
        newQuery.search = "";
        dispatch(setQuery(newQuery));

        dispatch(setResourcesLoading(true));
        dispatch(setFacetsQuery({}));
    }

    function toggleSidebar() {
        var toggle = !sidebarOpen;
        setSidebarOpen(toggle);
    }

    const handleCookie = (auth) => setCookie("JWT", auth, { maxAge: 86400 });

    useEffect(() => {
        const initUser = async () => {
            if (location.pathname === "/lom" && searchParams.get("courseId"))
                return;

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
                localStorage.setItem("lomes_loaded", "0");
                localStorage.setItem("lom_loaded", "0");
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

    if (location.pathname.startsWith('/cdn/')) {
        console.log({location})
        return ( <CdnRenderPage /> )
    } else if (location.pathname === "/lom") {
        return ( <LomPage handleCookie={handleCookie} handleLoading={handleLoading} loading={loading}/> );
    } else if (location.pathname === "/search" && localUser) {
        return ( <SearchPage user={user} /> );
    } else if ( location.pathname.startsWith("/resource/") && location.pathname.endsWith("/preview") && localUser ) {
        return ( <ResourcePreviewPage /> );
    } else if (location.pathname === '/cdn_panel' && localUser) {
        return ( <CdnPanelPage user={user}/> )
    } else if (localUser) {
        return ( <HomePage
                user={user}
                loading={loading}
                toggleSidebar={toggleSidebar}
                clearAllFilters={clearAllFilters}
                facetsQuery={facetsQuery}
                organization_id={organization_id}
                collection_id={collection_id}
                sidebarOpen={sidebarOpen}
                classes={classes}
            />);
    } else {
        return (<LoginPage loading={loading} />);
    }
}


export default App;
