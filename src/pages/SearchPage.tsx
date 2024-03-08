import React from "react";
import { Header } from "../features/Layout/Header/Header";
import Container from "@material-ui/core/Container";
import { Grid } from "@material-ui/core";
import XthemeProvider from "../providers/XthemeProvider";
import Search from "../features/Search/Search";

function SearchPage({user}) {
    return (
        <Container maxWidth="xl" disableGutters>
            <XthemeProvider>
                <Grid container>
                    <Grid item sm={12} className="main-header">
                        <Header _user={user} />
                    </Grid>
                </Grid>
                <Search />
            </XthemeProvider>
        </Container>
    );
}

export default SearchPage
