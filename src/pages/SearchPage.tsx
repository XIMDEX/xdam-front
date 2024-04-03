import React from "react";
import { Header } from "../features/Layout/Header/Header";
import Container from "@material-ui/core/Container";
import { Grid } from "@material-ui/core";
import Search from "../features/Search/Search";

function SearchPage() {
    return (
        <Container maxWidth="xl" disableGutters>
            <Grid container>
                <Grid item sm={12} className="main-header">
                    <Header/>
                </Grid>
            </Grid>
            <Search/>
        </Container>
    );
}

export default SearchPage
