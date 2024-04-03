import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import LoginAdminPanel from "../features/PanelCDN/LoginAdminPanel";
import PanelCDN from "../features/PanelCDN/PanelCDN";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: "400px",
        padding: "0 20px",
        margin: "25vh auto",
    },
    mbText: {
        marginBottom: 30,
    },
    title: {
        fontWeight: "bolder",
        marginBottom: 50,
        color: "#214F61",
    },
    btn: {
        backgroundColor: "#43a1a2",
        "&:hover, &:focus": {
            backgroundColor: "#43a1a2",
        },
    },
}));

function CdnPanelPage() {
    const [isAuth, setAuth] = useState(false);
    const classes = useStyles();

    const handleAuth = (auth) => {
        setAuth(auth);
    }

    return (
        <Container
            maxWidth="xl"
            disableGutters
            style={{
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {isAuth
                ? ( <PanelCDN classes={classes}/> )
                : ( <LoginAdminPanel handleAuth={handleAuth} classes={classes} /> )
            }
        </Container>
    );
}

export default CdnPanelPage;
