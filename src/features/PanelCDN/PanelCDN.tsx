import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { XInput, XButton, XDropdown, XPopUp } from '@ximdex/xui-react/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import NewCDNModal from "./NewCDNModal";
import { Loading } from "../Loading/Loading";

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
        minHeight: '60vh'
    }

  }),
);


function PanelCDN() {
    const classes = useStyles()
    const [loading, setLoading] = useState(true)
    const [cdnList, setCDNList] = useState([])


    useEffect(() => {
        setCDNList(['1cdn', '2cdn'])
        setLoading(false)
    }, []);


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
                {loading ? <Loading text="Loading CDN list"/>
                :
                <>
                    {cdnList.length === 0 ?
                        <h2>Cdn list is empty, add a new CDN to see something</h2>
                    :
                        <>
                            {cdnList.map((cdn, index) =>
                                <h2>{cdn}</h2>
                            )}
                        </>
                    }
                </>

                }
            </div>
        </Container>
    );
}

export default PanelCDN;
