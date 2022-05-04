import { Button } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React, { useContext } from "react"
import { render } from "../../../../utils/render";
import { ResourceMetaDataForm } from "./ResourceFormContext";

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

export const PreviewImage = () => {
    const classes = useStyles();
    const { state, dispatch } = useContext(ResourceMetaDataForm);

    const styleBtnPreview = {
        backgroundImage: 'url(' + (state.previewImage ? URL.createObjectURL(state.previewImage) : (state.dataForUpdate ? render(state.dataForUpdate) : 'noimg.png')) + ')',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    }

    return (
        <>
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
                    onChange={(e) => dispatch({ type: 'previewChanged', payload: e.target.files[0] }) }
                    name='Preview'
                    hidden
                    />
            </Button>
        </>
    )
}