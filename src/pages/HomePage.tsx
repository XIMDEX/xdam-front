import React from "react";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { Header } from "../features/Layout/Header/Header";
import { Loading } from "../features/Loading/Loading";
import Container from "@material-ui/core/Container";
import { Grid, Button, LinearProgress } from "@material-ui/core";
import Sidebar from "../features/Layout/Sidebar/Sidebar";
import { Resources } from "../features/Resources/Resources";

import _ from "lodash";
import { Icon } from "semantic-ui-react";
import XthemeProvider from "../providers/XthemeProvider";

function HomePage({
    user,
    loading,
    toggleSidebar,
    clearAllFilters,
    facetsQuery,
    organization_id,
    collection_id,
    sidebarOpen,
    classes
}) {
    return (

        <Container maxWidth="xl" disableGutters>
            {!sidebarOpen ? (
                <div>
                    <button
                        onClick={toggleSidebar}
                        className="xdam-btn-secondary bg-secondary btn-round-right btn-half-square toggleFacetsOpen"
                    >
                        <Icon name="angle right" />
                    </button>
                </div>
            ) : null}
            <XthemeProvider>
                <Router>
                    <Redirect to={{ pathname: "/home" }} />
                    {loading ? <Loading /> : null}
                    <Grid container>
                        <Grid item sm={12} className="main-header">
                            {organization_id && collection_id ? (
                                <Header _user={user} />
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
                                    onClick={toggleSidebar}
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
                            <Switch>
                                <Route path="/home">
                                    <LinearProgress
                                        id="circular-progress"
                                        className={"dnone"}
                                    ></LinearProgress>
                                    {organization_id && collection_id ? (
                                        <Resources
                                            sidebarOpen={sidebarOpen}
                                            collection={collection_id}
                                            organization={organization_id}
                                            _user={user}
                                        />
                                    ) : (
                                        ""
                                    )}
                                </Route>
                            </Switch>
                        </div>
                    </div>
                </Router>
            </XthemeProvider>
        </Container>
    )
}

export default HomePage
