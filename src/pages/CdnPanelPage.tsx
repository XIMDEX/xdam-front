import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import LoginAdminPanel from "../features/PanelCDN/LoginAdminPanel";
import PanelCDN from "../features/PanelCDN/PanelCDN";
import Modal from "../features/Resources/Modals/Modal/Modal";


function CdnPanelPage() {
    const [isAuth, setAuth] = useState(false);

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
                ? ( <PanelCDN/> )
                : ( <LoginAdminPanel handleAuth={handleAuth} /> )
            }
        </Container>
    );
}

export default CdnPanelPage;
