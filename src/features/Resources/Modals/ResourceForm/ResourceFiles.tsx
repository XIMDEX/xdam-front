import React, { useContext } from "react"
import {
    Button,
    ButtonGroup,
    Grid} from '@material-ui/core';
import ResourceActionButtons from "../ResourceActionButtons"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ResourceFormContex } from "./ResourceFormContext"
import { FileList } from "./FileList";
import { AttachFilesButton } from "./AttachFilesButton";
import { PreviewImage } from "./PreviewImage";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            width: '100%'
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        btnPreview: {
            height: 300,
        },
        blur: {
            filter: "blur(2px)",
        },
        addPreview: {
            display: 'none',
            position: 'absolute',
            zIndex: 1,
            left: '7%',
            top: 190,
            userSelect: 'none',
            pointerEvents: 'none'
        },
        dblock: {
            display: 'block'
        },
        formTag: {
            minHeight: 300
        },
        btnGroup: {
            width: '80%',
        },
        divider: {
            padding: '10px 0'
        },
        dismiss: {
            opacity: 1,
            transition: 'opacity 2s ease-'
        },
        imgView: {
            width: '100%'
        }
    }),
);

export const ResourceFiles = () => {
    const classes = useStyles();
    const { state } = useContext(ResourceFormContex);
    
    return (
        <>
            <ButtonGroup orientation='vertical'>
                <Grid item sm={12} style={{ minWidth: 400 }}>
                    <PreviewImage/>
                </Grid>

                <Grid item sm={12} className={classes.divider}>
                    {state.dataForUpdate ? (
                        <ResourceActionButtons resource={state.dataForUpdate} />
                    ) : null}
                </Grid>

                <Grid item sm={12}>
                    <AttachFilesButton />
                </Grid>
            </ButtonGroup>
            <div style={{ margin: '15px 42px 0px 0px' }}>
                { state?.files?.length > 0 && <FileList /> }
            </div>
        </>
    )
}