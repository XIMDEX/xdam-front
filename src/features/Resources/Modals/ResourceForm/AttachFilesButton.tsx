import { Button } from "@material-ui/core"
import React, { useContext } from "react"
import { MULTIMEDIA } from "../../../../constants"
import { ResourceMetaDataForm } from "./ResourceFormContext";

export const AttachFilesButton = () => {
    const { state, dispatch } = useContext(ResourceMetaDataForm);

    // function handleFiles(e) {
    //     e.preventDefault();

    //     dispatch({ type: 'filesAttached', payload: e.target.files});
    // }

    return (
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
                onChange={(e) => dispatch({ type: 'filesAttached', payload: Array.from(e.target.files) })}
                name='File'
                hidden
            />
        </Button>
    )
}