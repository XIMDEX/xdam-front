import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import { XInput, XButton, XDropdown, XPopUp } from '@ximdex/xui-react/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import NewCDNModal from "./NewCDNModal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layoutContainer: {
        backgroundColor: 'rgb(255, 255, 255)',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px',
    },
    headerContainer:{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        margin: '4em 0',
        padding: '2em'
    },
    contentContainer: {

    }

  }),
);


function PanelCDN() {
    const classes = useStyles()

    return (
        <Container maxWidth="lg">
            <div className={`${classes.headerContainer} ${classes.layoutContainer}`}>
                <h1 style={{margin: '0'}}>CDN PANEL</h1>
                <NewCDNModal
                    triggerButton = {
                        <XButton
                            title='Create CDN.'
                        >
                            <FontAwesomeIcon icon={faPlus}  size='1x' style={{marginRight: '8px'}}/>
                            CREATE CDN
                        </XButton>
                    }
                />

            </div>
            <div className={`${classes.contentContainer} ${classes.layoutContainer}`}>

            </div>
        </Container>
    );
}

export default PanelCDN;
