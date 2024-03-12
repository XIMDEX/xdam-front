import React, { useState } from "react";
import { Header } from "../features/Layout/Header/Header";
import Container from "@material-ui/core/Container";
import { Grid } from "@material-ui/core";
import XthemeProvider from "../providers/XthemeProvider";
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
    cdnsContainer: {
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column',
        width: '100%',
        height: 'auto',
        padding: '4em',
        margin: '4em auto',
        backgroundColor: 'white'
    },
    cdnsHeader: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1em'
    },
    cdnsTitle: {
        fontSize: '20px',
        color: "#214F61",
    },
    cdnsDetails: {
        fontSize: '15px',
        padding: '10px'
    },
    newCdnContainer: {
        display:'flex',
        alignItems: 'center'
    }
}));

function CdnPanelPage({ user }) {
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
            <XthemeProvider>
                <Grid container>
                    <Grid item sm={12} className="main-header">
                        <Header _user={user} />
                    </Grid>
                </Grid>
                {isAuth
                    ? ( <PanelCDN classes={classes}/> )
                    : ( <LoginAdminPanel handleAuth={handleAuth} classes={classes} /> )}
            </XthemeProvider>
        </Container>
    );
}

export default CdnPanelPage;
