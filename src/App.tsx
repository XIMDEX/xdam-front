import "./App.css";
import "semantic-ui-css/semantic.min.css";
import "./theme/main.scss";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    setUser,
    selectReloadApp,
    setWorkspaceCollections,
} from "./appSlice";
import { useHistory, useLocation } from "react-router-dom";
import MainService from "./api/service";
import {
    selectCollection,
    selectOrganization,
    selectFacetsQuery,
    setOrganization,
} from "./slices/organizationSlice";
import { setCollections, setCurrentCollection } from "./slices/collectionSlice";
import Routes from "./routes/Routes";
import { Loading } from "./features/Loading/Loading";
import { Header } from "./features/Layout/Header/Header";


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
                        history.push('/login')
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
    return <>
                    {(history.location.pathname === '/home' || history.location.pathname === '/cdn_panel' || history.location.pathname === '/search') &&
            <Header/>
        }
        {loading ? <Loading text="Loading user data..."/> : <Routes/>}
        </>
}


export default App;
