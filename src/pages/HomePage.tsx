import React, { useState } from "react";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { Header } from "../features/Layout/Header/Header";
import { Loading } from "../features/Loading/Loading";
import Container from "@material-ui/core/Container";
import { Grid, Button, LinearProgress, makeStyles } from "@material-ui/core";
import Sidebar from "../features/Layout/Sidebar/Sidebar";
import { Resources } from "../features/Resources/Resources";

import _ from "lodash";
import { Icon } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { selectCollection, selectFacetsQuery, selectOrganization, selectQuery, setFacetsQuery, setQuery } from "../slices/organizationSlice";
import { selectCatalogueFlag, setResourcesLoading } from "../appSlice";

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



function HomePage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const dispatch =  useDispatch()
    const facetsQuery = useSelector(selectFacetsQuery);
    const organization_id = useSelector(selectOrganization);
    const collection_id = useSelector(selectCollection);
    const query = useSelector(selectQuery);
    const classes =  useStyles()
    const loading = !useSelector(selectCatalogueFlag)

    const clearAllFilters = () => {
        let newQuery = {
            ...query,
        };

        newQuery.page = 1;
        newQuery.search = "";
        dispatch(setQuery(newQuery));

        dispatch(setResourcesLoading(true));
        dispatch(setFacetsQuery({}));
    }

    return (

        <Container maxWidth="xl" disableGutters>
            {!sidebarOpen ? (
                <div>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="xdam-btn-secondary bg-secondary btn-round-right btn-half-square toggleFacetsOpen"
                    >
                        <Icon name="angle right" />
                    </button>
                </div>
            ) : null}
                {loading ? <Loading /> : null}
                <Grid container>
                    <Grid item sm={12} className="main-header">
                        {organization_id && collection_id ? (
                            <Header />
                        ) : (
                            ""
                        )}
                    </Grid>
                </Grid>
                <div
                    className={
                        !sidebarOpen
                            ? "sidebarAndResourcesConainerFW"
                            : "sidebarAndResourcesConainer"
                    }
                >
                    <div
                        className={
                            !sidebarOpen ? "sideBarHidden" : "sideBar"
                        }
                    >
                        <Grid
                            container
                            className="justifyContentBetween mt-2"
                        >
                            <span className="facets_title mt-2 ">
                                <strong className={"darkLabel"}>
                                    FACETS
                                </strong>
                            </span>
                            <button
                                hidden={!sidebarOpen}
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="xdam-btn-primary bg-primary float-right btn-round-left btn-half-square toggleFacetsClose"
                            >
                                <Icon name="angle left" />
                            </button>
                        </Grid>
                        {!_.isEmpty(facetsQuery) ? (
                            <Button
                                color="primary"
                                style={{ marginRight: 27 }}
                                variant="outlined"
                                onClick={clearAllFilters}
                                className={classes.clearAllFilters}
                            >
                                Clear all filters
                            </Button>
                        ) : null}
                        {organization_id && collection_id ? (
                            <Sidebar
                                collection={collection_id}
                                organization={organization_id}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                    <div
                        style={{ marginTop: 4 }}
                        className={
                            !sidebarOpen
                                ? "RCFullWidth"
                                : "RCWithSidear"
                        }
                        id="main-r-c"
                    >
                        <LinearProgress
                            id="circular-progress"
                            className={"dnone"}
                        ></LinearProgress>
                        {organization_id && collection_id ? (
                            <Resources
                                sidebarOpen={sidebarOpen}
                                collection={collection_id}
                                organization={organization_id}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                </div>
        </Container>
    )
}

export default HomePage
