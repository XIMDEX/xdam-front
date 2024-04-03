import React from "react";
import { Header } from "../features/Layout/Header/Header";
import Container from "@material-ui/core/Container";
import Search from "../features/Search/Search";

function SearchPage() {
    return (
        <Container maxWidth="xl" disableGutters>
            <Search/>
        </Container>
    );
}

export default SearchPage
