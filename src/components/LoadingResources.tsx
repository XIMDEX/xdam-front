import { LinearProgress } from "@material-ui/core"
import React from "react"


const LoadingResources = ({loading}: {loading: boolean}): any => {

    if(loading)
        return <></>;

    return (
        <div style={{ opacity: 1, width: '100%', marginBottom: 2 }}>
            <LinearProgress />
        </div>
    )
}

export default LoadingResources