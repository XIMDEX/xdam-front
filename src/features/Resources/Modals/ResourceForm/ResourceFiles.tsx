import React, { useContext } from "react"
import {
    Button,
    ButtonGroup,
    Grid,
    Card
} from '@material-ui/core';
import { MULTIMEDIA } from "../../../../constants"
import { iconHandler } from "../../../../utils/iconHandler"
import ResourceActionButtons from "../ResourceActionButtons"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ResourceMetaDataForm } from "./ResourceFormContext"
import { render } from "../../../../utils/render"
import { Label, Icon } from 'semantic-ui-react'

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
    const { state } = useContext(ResourceMetaDataForm);

    const handleFiles = (_) => {

    }

    const styleBtnPreview = {
        backgroundImage: 'url(' + (state.previewImage ? URL.createObjectURL(state.previewImage) : (state.dataForUpdate ? render(state.dataForUpdate) : 'noimg.png')) + ')',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    }


    return (
        <>
            <ButtonGroup orientation='vertical'>
                <Grid item sm={12} style={{ minWidth: 400 }}>
                    <span
                        className={`${classes.addPreview}`}
                    >Uplad preview image</span>
                    <Button
                        className={`${classes.btnPreview}`}
                        component="label"
                        style={styleBtnPreview}
                        fullWidth
                        variant='outlined'
                    >
                        <input
                            accept="image/*"
                            type="file"
                            onChange={(e) => handleFiles(e)}
                            name='Preview'
                            hidden
                        />
                    </Button>
                </Grid>

                <Grid item sm={12} className={classes.divider}>
                    {state.dataForUpdate ? (
                        <ResourceActionButtons resource={state.dataForUpdate} />
                    ) : null}
                </Grid>

                <Grid item sm={12}>
                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                    >
                        Attach files
                        <input
                            type="file"
                            multiple
                            accept={state.resourceType === MULTIMEDIA ? "audio/*,video/*,image/*" : '*'}
                            onChange={(e) => handleFiles(e)}
                            name='File'
                            hidden
                        />
                    </Button>
                    {/* {resourceType === MULTIMEDIA ? (
                  <Label> You will upload a {mediaType}</Label>
              ) : null} */}
                </Grid>
            </ButtonGroup>
            <div style={{ margin: '15px 42px 0px 0px' }}>
                {
                    state.formFiles && state.formFiles.length > 0 ? (
                        <>
                            <Label>Adding:</Label>
                            {
                                Array.from(state.formFiles).map((f, i) => (
                                    <Card variant='outlined' className='associated-files-card' key={i}>
                                        <Icon name={iconHandler(f)}></Icon>
                                        <p><strong>File name:</strong> {f.name}</p>
                                        <p><strong>Mime type:</strong> {f.type}</p>
                                        <p><strong>Size:</strong> {(f.size / 1000000).toFixed(2)} MB</p>
                                    </Card>
                                ))
                            }
                        </>
                    ) : null
                }

            </div>
        </>
    )
}