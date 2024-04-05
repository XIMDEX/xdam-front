import React from "react";
import { useLocation } from "react-router-dom";
import Container from "@material-ui/core/Container";
import PreviewResource from "../features/Resources/Modals/PreviewResource";

function ResourcePreviewPage() {
    const location = useLocation();

    const urlParts = location.pathname.split("/");
    const resourceId = urlParts[2];
    const params = new URLSearchParams(location.search);
    const regexHashIsUUID = new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[0-4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$");

    const isCDN = !regexHashIsUUID.test(resourceId) || params.get("cdn") === "true";

    return (
        <Container maxWidth="xl" disableGutters>
            <PreviewResource resData={{ id: resourceId }} cdn={isCDN} />
        </Container>
    );
}

export default ResourcePreviewPage;
